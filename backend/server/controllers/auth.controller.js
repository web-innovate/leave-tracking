import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { UserSchema } from '../models/user.model';
import worker from '../../worker/worker';
import PasswordResetTokenSchema from '../models/password-reset-token.model';
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

function login(req, res, next) {
    User.findByEmailAndPassword(req.body.email, req.body.password)
        .then(user => {
            if(!user._id) {
                const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
                return next(err);
            }

            const token = jwt.sign({ id: user.id, userType: user.userType }, config.jwtSecret);

            return res.json({ token });
        })
        .catch(() => {
            const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
            return next(err);
        });
}

function me(req, res) {
    return User.get(req.user.id).then(user => {
        user = user.toObject();
        delete user.password;

        return res.json(user);
    });
}

async function recover(req, res, next) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.json();
    }

    let safeUser = user.toObject();
    delete safeUser.password;


    const resetToken = new PasswordResetTokenSchema({
        userId: safeUser._id,
        used: false
    });


    const savedToken = await resetToken.save();


    const data = { user: safeUser, token: savedToken.toObject() };

    worker.queuePasswordReset(data);

    res.json(data);

}

export default { login, me, recover };
