function handleNewUsers(params, callback) {
    console.log('123123')
    try {
        var result = 'sent emails for the created user';
        console.log('processed', result, params);
        callback(null, result);
    } catch (err) {
        callback(err);
    }
}

export default { handleNewUsers };
