import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const LeaveRequestSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    leaveType: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    workDays: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


LeaveRequestSchema.method({
});


LeaveRequestSchema.statics = {
    get(id) {
        return this.findById(id)
            .exec()
            .then((leaveRequest) => {
                if (leaveRequest) {
                    return leaveRequest;
                }
                const err = new APIError('No such LeaveRequest', httpStatus.NOT_FOUND, true);
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

export default mongoose.model('LeaveRequest', LeaveRequestSchema);
