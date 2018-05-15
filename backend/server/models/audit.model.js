import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const AuditSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: String,
        required: true
    },
    target_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    target_holiday: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Holiday',
    },
    target_leave_request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
    },
    target_project_role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectRole',
    },
    target_project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AuditSchema.method({
});

AuditSchema.statics = {
    get(id) {
        return this.findById(id)
            .populate('author', '-password')
            .then((audit) => {
                if (audit) {
                    return audit;
                }
                const err = new APIError('No such Audit exists!', httpStatus.NOT_FOUND, true);
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

export default mongoose.model('Audit', AuditSchema);
