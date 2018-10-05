import moment from 'moment';
import LeaveRequest from '../models/leave-request.model';
import User from '../models/user.model';
import Project from '../models/project.model';
import worker from '../../worker/worker';
import APIError from '../helpers/APIError';
import { USER_TYPES, LEAVE_TYPES, REQUEST_STATUS } from '../helpers/constants';

function load(req, res, next, id) {
    LeaveRequest.get(id)
        .then((leaveRequest) => {
            req.leaveRequest = leaveRequest;
            next();
            return null;
        })
        .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.leaveRequest);
}

async function create(req, res, next) {
    const {token} = req;
    const leave = new LeaveRequest(
        {
            start: req.body.start,
            end: req.body.end,
            leaveType: req.body.leaveType,
            lastUpdatedBy: token.id,
            userId: token.id,
            status: req.body.status,
            workDays: req.body.workDays
        });

    const pendingAndApproved = await LeaveRequest
        .find({
            userId: token.id,
            $or: [{status: REQUEST_STATUS.APPROVED}, {status: REQUEST_STATUS.PENDING}]
        });

    const overlapFound = pendingAndApproved.some(item => checkForOverlap(item, leave, next));

    // stop from saving the request
    if (overlapFound) {
        return;
    }

    leave.save()
        .then(savedLeave => {
            worker.queueNewLeaveRequest(savedLeave.toObject());
            return updateUserDaysForCreatedLeave(savedLeave, res);
        })
        .catch(e => next(e));
}

async function updateUserDaysForCreatedLeave(savedLeave, res) {
    const { leaveType, userId, workDays, status } = savedLeave;
    const user = await User.findById(userId);

    if (leaveType === LEAVE_TYPES.ANNUAL && status === REQUEST_STATUS.PENDING) {
        user.pending += workDays;
        await user.save();
    }

    return res.json(savedLeave);
}

function updateStatus(req, res, next) {
    const leave = req.leaveRequest;

    leave.status = req.body.status;

    leave.save()
        .then(async savedLeave => {
            const { status, userId, workDays } = savedLeave;
            const user = await User.findById(userId);

            if (status === REQUEST_STATUS.APPROVED) {
                worker.queueApprovedLeaveRequest(savedLeave.toObject());
                user.taken += workDays;
                user.pending -= workDays;
                user.holidays -= workDays;
                await user.save();
            }

            if (status === REQUEST_STATUS.REJECTED) {
                worker.queueRejectedLeaveRequest(savedLeave.toObject());
                user.pending -= workDays;
                await user.save();
            }

            return res.json(savedLeave);
        })
        .catch(e => next(e));
}

async function update(req, res, next) {
    const lastUpdatedBy = await User.findById(req.token.id);
    const leave = req.leaveRequest;
    const { workDays, leaveType } = leave;
    const prevType = leaveType;
    const daysDiff = workDays - req.body.workDays;

    leave.start = req.body.start;
    leave.end = req.body.end;
    leave.workDays = req.body.workDays;
    leave.leaveType = req.body.leaveType;
    leave.lastUpdatedBy = lastUpdatedBy._id;

    leave.save()
        .then(async savedLeave => {
            const { userId, leaveType, status, workDays } = savedLeave;
            const { ANNUAL } = LEAVE_TYPES;
            const user = await User.findById(userId);
            const isAnnual = leaveType === prevType && leaveType === ANNUAL;
            const changedToAnnual = leaveType === ANNUAL && prevType !== ANNUAL;
            const changedFromAnnual = leaveType !== ANNUAL && prevType === ANNUAL;

            if (status === REQUEST_STATUS.PENDING) {
                if (isAnnual) {
                    user.pending -= daysDiff;
                }
                if (changedToAnnual) {
                    user.pending += workDays;
                }
                if (changedFromAnnual) {
                    user.pending -= (workDays + daysDiff);
                }
                await user.save();
            }

            if (status === REQUEST_STATUS.APPROVED) {
                if (isAnnual) {
                    user.taken -= daysDiff;
                    user.holidays += daysDiff;
                }
                if (changedToAnnual) {
                    user.taken += savedLeave.workDays;
                    user.holidays -= savedLeave.workDays;
                }
                if (changedFromAnnual) {
                    user.taken -= (savedLeave.workDays + daysDiff);
                    user.holidays += (savedLeave.workDays + daysDiff);
                }
                await user.save();
            }

            return res.json(savedLeave);
        })
        .catch(e => next(e));
}

function remove(req, res, next) {
    const leave = req.leaveRequest;
    const { userType } = req.token;

    const hasRights = (leave.status === REQUEST_STATUS.PENDING && userType === USER_TYPES.USER)
        || (leave.status !== REQUEST_STATUS.REJECTED && userType === USER_TYPES.ADMIN);

    if (hasRights) {
        return leave.remove()
            .then(async deleted => {
                worker.queueCanceledLeaveRequest(deleted.toObject());
                const { userId, leaveType, status, workDays } = deleted;
                const user = await User.findById(userId);

                if (leaveType === LEAVE_TYPES.ANNUAL) {
                    switch (status) {
                    case REQUEST_STATUS.APPROVED:
                        user.taken -= workDays;
                        user.holidays += workDays;
                        break;
                    case REQUEST_STATUS.PENDING:
                        user.pending -= workDays;
                        break;
                    }

                    await user.save();
                    return res.json(leave);
                }
            })
            .catch(e => next(e));
    } else {
        next(new APIError('You do not have right to delete this leave request.', 403, true));
    }
}

function list(req, res, next) {
    const {limit = 50, skip = 0} = req.query;
    LeaveRequest.list({limit, skip})
        .then(users => res.json(users))
        .catch(e => next(e));
}

function getForUser(req, res, next) {
    const {userId} = req.params;

    LeaveRequest.find({userId})
        .then(leaves => res.json(leaves))
        .catch(e => next(e));
}

function checkForOverlap(item, leave, next) {
    const currentStart = moment(leave.start);
    const currentEnd = moment(leave.end);
    let {start, end} = item;

    start = moment(start);
    end = moment(end);

    const overlaps = currentStart.isBefore(end) && start.isBefore(currentEnd);

    if (overlaps) {
        const existing = {
            message: 'There is a leave-request already created that overlaps with your dates',
            start,
            end,
            status: item.status
        };

        next(new APIError(existing, 400, true));
        return overlaps;
    }
}

function pending(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, REQUEST_STATUS.PENDING)
        .then(pendingLeaves => res.json(pendingLeaves))
        .catch(e => next(e));
}

function approved(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, REQUEST_STATUS.APPROVED)
        .then(approvedLeaves => res.json(approvedLeaves))
        .catch(e => next(e));
}

function rejected(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, REQUEST_STATUS.REJECTED)
        .then(rejectedLeaves => res.json(rejectedLeaves))
        .catch(e => next(e));
}

async function fetchLeaves(userId, status) {
    const user = await User.findOne({_id: userId});
    if (user.userType === USER_TYPES.ADMIN) {
        return LeaveRequest
            .find({status})
            .populate('userId')
            .populate('lastUpdatedBy');
    } else {
        const projectsQuery = {approvers: {$in: [userId]}};
        const projectsICanApprove = (await Project.find(projectsQuery)).map(proj => proj._id);

        const usersQuery = {projectId: {$in: projectsICanApprove}};
        const usersICanApprove = (await User.find(usersQuery)).map(usr => usr._id);

        const leaveQuery = {status, userId: {$in: usersICanApprove}};
        return LeaveRequest
            .find(leaveQuery)
            .populate('userId')
            .populate('lastUpdatedBy');
    }
}

export default { load, get, create, update, updateStatus, remove, list, getForUser, pending, approved, rejected};
