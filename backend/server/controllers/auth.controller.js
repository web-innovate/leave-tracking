import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { UserSchema } from '../models/user.model';
import worker from '../../worker/worker';
import PasswordResetTokenSchema from '../models/password-reset-token.model';
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

async function login(req, res, next) {
    const unauthorizedError = new APIError('Bad credentials', httpStatus.UNAUTHORIZED, true);
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user && !user._id) {
        return next(unauthorizedError);
    }

    const dbHash = user.password;

    const match = await bcrypt.compare(password, dbHash);

    if(!match) {
        return next(unauthorizedError);
    }

    const token = jwt.sign({ id: user.id, userType: user.userType }, config.jwtSecret);

    res.json({ token });
}

function me(req, res) {
    return User.get(req.user.id).then(user => {
        user = user.toObject();
        delete user.password;

        return res.json(user);
    });
}

async function recover(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if(!user) {
        return res.json();
    }

    let safeUser = user.toObject();
    delete safeUser.password;

    // query for unused tokens for the given user id
    const notUsedTokenQuery = {
        userId: safeUser._id,
        used: false
    };

    // mark previously not used tokens as invalid before we generate a new one
    await PasswordResetTokenSchema.update(notUsedTokenQuery, { used: true }, { multi: true });

    const resetToken = new PasswordResetTokenSchema({
        userId: safeUser._id,
        used: false
    });

    const savedToken = await resetToken.save();

    const data = { user: safeUser, token: savedToken.toObject() };

    worker.queuePasswordReset(data);

    res.json();

}

async function reset(req, res, next) {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
        return next(new APIError('Passwords do not match', httpStatus.BAD_REQUEST, true));
    }

    const dbToken = await PasswordResetTokenSchema.findOne({ token });

    if(!dbToken) {
        return next(new APIError('Invalid token', httpStatus.BAD_REQUEST, true));
    }

    if(dbToken.used) {
        return next(new APIError('Token was already used', httpStatus.BAD_REQUEST, true));
    }

    const { userId } = dbToken;
    const user = await User.findOne({ _id: userId });

    if(!user) {
        return next(new APIError('User linked to token does not exist', httpStatus.BAD_REQUEST, true));
    }

    user.password = bcrypt.hashSync(password, 10);
    await user.save();

    dbToken.used = true;
    await dbToken.save();

    res.json();
}

export default { login, me, recover, reset };
