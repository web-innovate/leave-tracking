import smtp from '../../smtp/smtp';
import User from '../../server/models/user.model';
import Project from '../../server/models/project.model';

async function handleNewLeaveRequest(params, callback) {
    const { userId, leaveType } = params;

    const user = await getUserDetails(userId);
    const { email, projectId, firstName, lastName } = user;

    const project = await getProjectDetails(projectId);
    const { approvers } = project;

    const approversEmails = await Promise.all(approvers.map(async (approverUserId) => {
        const approverDetails = await getUserDetails(approverUserId);

        return approverDetails.email;
    }));

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
    return User.findOne({ _id });
}

function getProjectDetails(_id) {
    return Project.findOne({ _id });
}

export default { handleNewLeaveRequest };
