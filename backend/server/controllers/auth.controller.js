import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { UserSchema } from '../models/user.model';
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);
/**
* Returns jwt token if valid email and password is provided
* @param req
* @param res
* @param next
* @returns {*}
*/
function login(req, res, next) {
    User.findByEmailAndPassword(req.body.email, req.body.password)
        .then(user => {
            if(!user._id) {
                const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
                return next(err);
            }

            const token = jwt.sign({ id: user.id }, config.jwtSecret);

            return res.json({ token });
        });
}

/**
* This is a protected route. Will return random number only if jwt token is provided in header.
* @param req
* @param res
* @returns {*}
*/
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

function me(req, res) {
    return User.get(req.user.id).then(user => {
        user = user.toObject();
        delete user.password;

        return res.json(user)
    });
}

export default { login, getRandomNumber, me };
