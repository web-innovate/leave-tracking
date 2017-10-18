import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const HolidaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true }
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

HolidaySchema.method({
});

HolidaySchema.statics = {
    get(id) {
        return this.findById(id)
        .exec()
        .then((holiday) => {
            if (holiday) {
                return holiday;
            }
            const err = new APIError('No such Holiday exists!', httpStatus.NOT_FOUND, true);
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

export default mongoose.model('Holiday', HolidaySchema);
