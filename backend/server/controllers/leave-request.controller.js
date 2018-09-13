import _ from 'lodash';
import moment from 'moment';
import LeaveRequest from '../models/leave-request.model';
import User from '../models/user.model';
import Project from '../models/project.model';
import worker from '../../worker/worker';
import APIError from '../helpers/APIError';
import {USER_TYPES} from "../helpers/Constants";

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
            userId: token.id,
            status: req.body.status,
            workDays: req.body.workDays
        });

    const pendingAndApproved = await LeaveRequest
        .find({
            userId: token.id,
            $or: [{status: 'approved'}, {status: 'pending'}]
        });

    const overlapFound = pendingAndApproved.some(item => checkForOverlap(item, leave, next));

    //stop from saving the request
    if (overlapFound) {
        return;
    }

    leave.save()
        .then(savedLeave => {
            worker.queueNewLeaveRequest(savedLeave.toObject());
            return savedLeave;
        })
        .then(savedLeave => updateUserData(savedLeave, res))
        .catch(e => next(e));
}

async function update(req, res, next) {
    const {token} = req;
    const leave = req.leaveRequest;

    leave.status = req.body.status;

    const lastUpdatedBy = await User.findOne({_id: token.id});
    leave.lastUpdatedBy = lastUpdatedBy;

    leave.save()
        .then(savedRequest => {
            const {leaveType, status, userId, workDays} = savedRequest;

            // we attach the id of the user that updated the request
            savedRequest.approverId = token.id;

            if (status === 'approved') {
                worker.queueApprovedLeaveRequest(savedRequest.toObject());
            }

            if (status === 'rejected') {
                worker.queueRejectedLeaveRequest(savedRequest.toObject());
            }

            if (status === 'canceled') {
                worker.queueCanceledLeaveRequest(savedRequest.toObject());
            }

            // decrease the remaining days only for annual leave
            if (leaveType === 'annual-leave') {
                return User.get(userId)
                    .then(usr => {
                        if (status === 'approved') {
                            usr.taken += workDays;
                            usr.pending -= workDays;
                            usr.holidays -= workDays;
                        }

                        if (status === 'rejected') {
                            usr.pending -= workDays;
                        }

                        if (status === 'canceled') {
                            usr.pending -= workDays;
                        }

                        return usr.save()
                            .then(() => res.json(savedRequest));
                    });
            } else {
                return res.json(savedRequest);
            }
        })
        .catch(e => next(e));
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

function updateUserData(savedLeave, res) {
    const {leaveType, userId, workDays, status} = savedLeave;

    if (leaveType === 'annual-leave' && status === 'pending') {
        return User.get(userId)
            .then(usr => {
                usr.pending += workDays;

                return usr.save()
                    .then(() => res.json(savedLeave));
            });
    } else {
        return res.json(savedLeave);
    }
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

    fetchLeaves(token.id, 'pending')
        .then(pendingLeaves => res.json(pendingLeaves))
        .catch(e => next(e));
}

function approved(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, 'approved')
        .then(approvedLeaves => res.json(approvedLeaves))
        .catch(e => next(e));
}

function rejected(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, 'rejected')
        .then(rejectedLeaves => res.json(rejectedLeaves))
        .catch(e => next(e));
}

async function fetchLeaves(userId, status) {
    const user = await User.findOne({_id: userId});
    if (user.userType === USER_TYPES.ADMIN) {
        console.log('user is admin')
        return LeaveRequest.find({status})
    } else {
        const projectsQuery = {approvers: {$in: [userId]}};
        const projectsICanApprove = await fetchProjects(projectsQuery);

        let usersICanApprove = await Promise.all(projectsICanApprove.map(async projectId => {
            return await Promise.all(fetchUsers(projectId));
        }));

        usersICanApprove = _.flatten(usersICanApprove);

        const leaveQuery = {status, userId: {$in: usersICanApprove}};

        return LeaveRequest.find(leaveQuery);
    }
}

function fetchUsers(projectId) {
    return User.find({projectId})
        .then(users => users.map(u => u._id));
}

function fetchProjects(query) {
    return Project.find(query)
        .then(projects => projects.map(p => p._id));
}

function canceled(req, res, next) {
    const {token} = req;

    fetchLeaves(token.id, 'canceled')
        .then(canceledLeaves => res.json(canceledLeaves))
        .catch(e => next(e));
}

export default {load, get, create, update, list, getForUser, pending, approved, rejected, canceled};
