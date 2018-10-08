import moment from 'moment';
import smtp from '../../smtp/smtp';
import User from '../../server/models/user.model';
import Project from '../../server/models/project.model';

const FORMAT = 'DD MMM YYYY';

async function handleNewLeaveRequest(leave, callback) {
    try {
        const { leaveType } = leave;
        const { user, project, approversData, approversEmails } = await getAndAgredateLeaveRequestData(leave);
        const { email, firstName, lastName } = user;

        leave.projectName = project.name;
        leave.approvers = approversData;
        leave.employee = user;
        leave.start = moment(leave.start).format(FORMAT);
        leave.end = moment(leave.end).format(FORMAT);
        leave.createdAt = moment(leave.createdAt).format(FORMAT);

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, here is your leave request`;
        const approverEmailSubject = `[${leaveType}] Leave request pending for: ${firstName} ${lastName}`;

        Promise.all([
            smtp.sendMail(email, userEmailSubject, 'newUserLeaveRequest', leave),
            smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'newApproverLeaveRequest', leave)
        ]).then(info => callback(null, info))
    } catch(error) {
        console.log('handleNewLeaveRequest:', error);
        return callback(error);
    }
}

async function handleApprovedLeaveRequest(leave, callback) {
    try {
        const { leaveType } = leave;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(leave);
        const { email, firstName, lastName } = user;

        leave.projectName = project.name;
        leave.approvers = approversData;
        leave.employee = user;
        leave.approver = approver;
        leave.start = moment(leave.start).format(FORMAT);
        leave.end = moment(leave.end).format(FORMAT);
        leave.createdAt = moment(leave.createdAt).format(FORMAT);

        const approvedCopyEmailAddress = process.env.APPROVED_LEAVE_CC_EMAIL;
        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been APPROVED`;
        const approverEmailSubject = `[${leaveType}] APPROVED Leave request for: ${firstName} ${lastName}`;

        Promise.all([
            smtp.sendMail(`${email},${approvedCopyEmailAddress}`, userEmailSubject, 'approvedLeaveRequest', leave),
            smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'approvedLeaveRequest', leave)
        ]).then(info => callback(null, info))
    } catch(error) {
        console.log('handleApprovedLeaveRequest:', error);
        return callback(error);
    }
}

async function handleRejectedLeaveRequest(leave, callback) {
    try {
        const { leaveType } = leave;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(leave);
        const { email, firstName, lastName } = user;

        leave.projectName = project.name;
        leave.approvers = approversData;
        leave.employee = user;
        leave.approver = approver;
        leave.start = moment(leave.start).format(FORMAT);
        leave.end = moment(leave.end).format(FORMAT);
        leave.createdAt = moment(leave.createdAt).format(FORMAT);

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been DECLINED`;
        const approverEmailSubject = `[${leaveType}] DECLINED Leave request for: ${firstName} ${lastName}`;

        Promise.all([
            smtp.sendMail(email, userEmailSubject, 'declinedLeaveRequest', leave),
            smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'declinedLeaveRequest', leave)
        ]).then(info => callback(null, info))
    } catch(error) {
        console.log('handleRejectedLeaveRequest:', error);
        return callback(error);
    }
}

async function handleCanceledLeaveRequest(leave, callback) {
    try {
        const { leaveType } = leave;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(leave);
        const { email, firstName, lastName } = user;

        leave.projectName = project.name;
        leave.approvers = approversData;
        leave.employee = user;
        leave.approver = approver;
        leave.start = moment(leave.start).format(FORMAT);
        leave.end = moment(leave.end).format(FORMAT);
        leave.createdAt = moment(leave.createdAt).format(FORMAT);

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been CANCELED`;
        const approverEmailSubject = `[${leaveType}] CANCELED Leave request for: ${firstName} ${lastName}`;
        Promise.all([
            smtp.sendMail(email, userEmailSubject, 'canceledLeaveRequest', leave),
            smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'canceledLeaveRequest', leave)
        ]).then(info => callback(null, info))
    } catch(error) {
        console.log('handleCanceledLeaveRequest:', error);
        return callback(error);
    }
}

function getUserDetails(_id) {
    return User.findOne({ _id }).populate('projectId');
}

function getProjectDetails(_id) {
    return Project.findOne({ _id }).populate('approvers');
}

async function getAndAgredateLeaveRequestData(leave) {
    const { userId, lastUpdatedBy } = leave;

    const user = await getUserDetails(userId);
    const { projectId } = user;

    const approver = await getUserDetails(lastUpdatedBy);

    const project = await getProjectDetails(projectId);
    const approvers = (project || {}).approvers || [];

    const approversEmails = approvers.map(i => i.email);

    return {
        user,
        project,
        approver,
        approversData: approvers,
        approversEmails
    };
}

export default { handleNewLeaveRequest, handleApprovedLeaveRequest, handleRejectedLeaveRequest, handleCanceledLeaveRequest };
