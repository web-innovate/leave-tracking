import smtp from '../../smtp/smtp';

function handleNewUsers(params, callback) {
    try {
        const result = 'sent emails for the created user';
        const { email, firstName } = params;

        smtp.sendMail(
            email,
            `${firstName} your account has been created`,
            `<b>html: ${JSON.stringify(params)}</b>`
        );

        console.log('processed', result, params);
        callback(null, result);
    } catch (err) {
        callback(err);
    }
}

export default { handleNewUsers };
