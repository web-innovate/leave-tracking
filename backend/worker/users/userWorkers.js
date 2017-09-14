import smtp from '../../smtp/smtp';

function handleNewUsers(params, callback) {
    const { email, firstName } = params;
    const emailSubject = `${firstName} your account has been created`;

    smtp.sendMail(email, emailSubject, 'newUser', params)
        .then(info => callback(null, info))
        .catch(err => callback(err));
}

export default { handleNewUsers };
