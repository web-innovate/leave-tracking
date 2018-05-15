import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import smtp from '../../smtp/smtp';
import { UserSchema } from '../../server/models/user.model';

const User = mongoose.model('User', UserSchema);

function handleNewUsers(params, callback) {
    const { email, firstName } = params;
    const emailSubject = `${firstName} your account has been created`;

    smtp.sendMail(email, emailSubject, 'newUser', params)
        .then(info => callback(null, info))
        .catch(err => callback(err));
}

function handlePasswordReset(params, callback) {
    const { email, firstName } = params.user;
    const fe_domain = process.env.fe_domain || 'http://localhost:9000';

    params.domain = fe_domain;

    const emailSubject = `${firstName} password reset`;

    smtp.sendMail(email, emailSubject, 'resetPassword', params)
        .then(info => callback(null, info))
        .catch(err => callback(err));
}

function createDefaultUser(params, cb) {
    User.count()
        .then(result => {
            if (result !== 0) {
                return cb(null, {result});
            }

            const user = new User({
                startDate: Date.now(),
                firstName: 'admin',
                lastName: 'admin',
                email: 'admin@admin',
                password: bcrypt.hashSync('admin', 10),
                holidays: 99,
                position: '',
                projectId: '',
                userType: 'ADMIN'
            });



            user.save()
                .then(data => cb(null, data))
                .catch(err => cb(err));
        })
        .catch(err => cb(err));
}

export default { handleNewUsers, handlePasswordReset, createDefaultUser };
