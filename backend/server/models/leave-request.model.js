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
    approverId: {
        type: String,
        required: false
    },
    leaveType: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
    }
});

LeaveRequestSchema.statics = {
    get(id) {
        return this.findById(id)
            .populate('userId')
            .populate('lastUpdatedBy')
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
            .populate('userId')
            .populate('lastUpdatedBy')
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit);
    }
};

export default mongoose.model('LeaveRequest', LeaveRequestSchema);
