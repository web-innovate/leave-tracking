import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    holidays: {
        type: Number,
        required: true
    },
    taken: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
    },
    position: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.method({
});


UserSchema.statics = {
    get(id) {
        return this.findById(id)
        .exec()
        .then((user) => {
            if (user) {
                return user;
            }
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
    },

    findByEmailAndPassword(email, password) {
        email = email.toLowerCase();

        return this.findOne({ email, password })
        .exec()
        .then(user => {
            if(user) {
                return user;
            }

            const err = new APIError('Bad credentials', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
    },

    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
        .sort({ createdAt: -1 })
        .skip(+skip)
        .limit(+limit)
        .exec();
    }
};

export default mongoose.model('User', UserSchema);
