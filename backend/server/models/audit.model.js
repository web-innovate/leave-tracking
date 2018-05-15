import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const AuditSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
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
