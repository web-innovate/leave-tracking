import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const ProjectRoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true }
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

ProjectRoleSchema.method({
});

ProjectRoleSchema.statics = {
    get(id) {
        return this.findById(id)
            .exec()
            .then((projectRole) => {
                if (projectRole) {
                    return projectRole;
                }
                const err = new APIError(`No such project-role with id '${id}'exists!`, httpStatus.NOT_FOUND, true);
                return Promise.reject(err);
            });
    },

    list({ skip = 0, limit = 50, extra = {} } = {}) {
        return this.find(extra)
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

export default mongoose.model('ProjectRole', ProjectRoleSchema);
