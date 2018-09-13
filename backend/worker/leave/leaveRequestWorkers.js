import smtp from '../../smtp/smtp';
import User from '../../server/models/user.model';
import Project from '../../server/models/project.model';

async function handleNewLeaveRequest(params, callback) {
    try {
        const { leaveType } = params;
        const { user, project, approversData, approversEmails } = await getAndAgredateLeaveRequestData(params);
        const { email, firstName, lastName } = user;

        params.projectName = project.name;
        params.approvers = approversData;
        params.employee = user;

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, here is your leave request`;
        const approverEmailSubject = `[${leaveType}] Leave request pending for: ${firstName} ${lastName}`;

        Promise.all(
            [
                smtp.sendMail(email, userEmailSubject, 'newUserLeaveRequest', params),
                smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'newApproverLeaveRequest', params)
            ])
            .then(info => callback(null, info))
    } catch(error) {
        console.log('problems are all the time handleNewLeaveRequest', error)
        return callback(error);
    }
}

async function handleApprovedLeaveRequest(params, callback) {
    try {
        const { leaveType } = params;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(params);
        const { email, firstName, lastName } = user;

        params.projectName = project.name;
        params.approvers = approversData;
        params.employee = user;
        params.approver = approver;


        const approvedCopyEmailAddress = process.env.APPROVED_LEAVE_CC_EMAIL || 'hr@APPROVED_LEAVE_CC_EMAIL.com';


        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been APPROVED`;
        const approverEmailSubject = `[${leaveType}] APPROVED Leave request for: ${firstName} ${lastName}`;

        Promise.all(
            [
                smtp.sendMail(`${email},${approvedCopyEmailAddress}`, userEmailSubject, 'approvedLeaveRequest', params),
                smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'approvedLeaveRequest', params)
            ])
            .then(info => callback(null, info))
    } catch(error) {
        return callback(error);
    }
}

async function handleRejectedLeaveRequest(params, callback) {
    try {
        const { leaveType } = params;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(params);
        const { email, firstName, lastName } = user;

        params.projectName = project.name;
        params.approvers = approversData;
        params.employee = user;
        params.approver = approver;

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been DECLINED`;
        const approverEmailSubject = `[${leaveType}] DECLINED Leave request for: ${firstName} ${lastName}`;

        Promise.all(
            [
                smtp.sendMail(email, userEmailSubject, 'declinedLeaveRequest', params),
                smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'declinedLeaveRequest', params)
            ])
            .then(info => callback(null, info))
    } catch(error) {
        return callback(error);
    }
}

async function handleCanceledLeaveRequest(params, callback) {
    try {
        const { leaveType } = params;
        const { user, project, approver, approversData, approversEmails } = await getAndAgredateLeaveRequestData(params);
        const { email, firstName, lastName } = user;

        params.projectName = project.name;
        params.approvers = approversData;
        params.employee = user;
        params.approver = approver;

        const userEmailSubject = `[${leaveType}] Hi ${firstName}, your leave request has been CANCELED`;
        const approverEmailSubject = `[${leaveType}] CANCELED Leave request for: ${firstName} ${lastName}`;

        Promise.all(
            [
                smtp.sendMail(email, userEmailSubject, 'canceledLeaveRequest', params),
                smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'canceledLeaveRequest', params)
            ])
            .then(info => callback(null, info))
    } catch(error) {
        return callback(error);
    }
}

function getUserDetails(_id) {
    return User.findOne({ _id }).then(result => stripSensitiveData(result));
}

function getProjectDetails(_id) {
    return Project.findOne({ _id }).then(result => result.toObject());
}

function stripSensitiveData(bson) {
    if (!bson) {
        return;
    }

    const noSensitive = bson.toObject();

    delete noSensitive.password;

    return noSensitive;
}

async function getAndAgredateLeaveRequestData(params) {
    const { userId, approverId } = params;


    console.log('>>>', params)

    const user = await getUserDetails(userId);
    const { projectId } = user;

    console.log('luser', user)


    console.log('proj id ', projectId)

    const project = await getProjectDetails(projectId);
    const { approvers } = project;

    const approver = await getUserDetails(approverId);

    const approversData =
        await Promise.all(approvers.map(async (approverUserId) => {
            return await getUserDetails(approverUserId);
        }));

    const approversEmails = approversData.map(approver => approver.email);

    return {
        user,
        project,
        approver,
        approversData,
        approversEmails
    };
}

export default { handleNewLeaveRequest, handleApprovedLeaveRequest, handleRejectedLeaveRequest };
