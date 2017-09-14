import smtp from '../../smtp/smtp';

function handleNewUsers(params, callback) {
    const { email, firstName } = params;
    const htmlContent = `<b>html: ${JSON.stringify(params)}</b>`;
    const emailSubject = `${firstName} your account has been created`;

    smtp.sendMail(email, emailSubject, htmlContent)
        .then(info => callback(null, info))
        .catch(err => callback(err));
}

export default { handleNewUsers };
