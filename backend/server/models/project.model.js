import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true }
    },
    approvers: {
        type: [ String ],
        required: true
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

ProjectSchema.method({
});

ProjectSchema.statics = {
    get(id) {
        return this.findById(id)
        .exec()
        .then((project) => {
            if (project) {
                return project;
            }
            const err = new APIError('No such project exists!', httpStatus.NOT_FOUND, true);
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

export default mongoose.model('Project', ProjectSchema);
