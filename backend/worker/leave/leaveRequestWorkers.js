import smtp from '../../smtp/smtp';
import User from '../../server/models/user.model';
import Project from '../../server/models/project.model';

async function handleNewLeaveRequest(params, callback) {
    const { userId, leaveType } = params;

    const user = await getUserDetails(userId);
    const { email, projectId, firstName, lastName } = user;

    const project = await getProjectDetails(projectId);
    const { approvers } = project;

    const approversData =
        await Promise.all(approvers.map(async (approverUserId) => {
            return await getUserDetails(approverUserId);
        }));

    const approversEmails = approversData.map(approver => approver.email);


    params.projectName = project.name;
    params.approvers = approversData;
    params.employee = user;

    const userEmailSubject = `[${leaveType}] Hi ${firstName}, here is your leave request`;
    const approverEmailSubject = `[${leaveType}] Leave request pending for: ${firstName} ${lastName}`;


    smtp.sendMail(email, userEmailSubject, 'newUserLeaveRequest', params)
        .then(info => callback(null, info))
        .catch(err => callback(err));

    smtp.sendMail(approversEmails.join(','), approverEmailSubject, 'newApproverLeaveRequest', params)
        .then(info => callback(null, info))
        .catch(err => callback(err));
}

function getUserDetails(_id) {
    return User.findOne({ _id }).then(result => stripSensitiveData(result));
}

function getProjectDetails(_id) {
    return Project.findOne({ _id }).then(result => result.toObject());
}

function stripSensitiveData(bson) {
    const noSensitive = bson.toObject();

    delete noSensitive.password;

    return noSensitive;
}

export default { handleNewLeaveRequest };
