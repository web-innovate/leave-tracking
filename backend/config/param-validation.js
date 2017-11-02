import Joi from 'joi';

export default {
    createUser: {
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            holidays: Joi.number().required(),
            position: Joi.string().required(),
            projectId: Joi.string().hex().required(),
            userType: Joi.string().required()
        }
    },

    createProject: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            roles: Joi.array().items(Joi.string()).required(),
            approvers: Joi.array().items(Joi.string()).required()
        }
    },

    createProjectRole: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required()
        }
    },

    createLeaveRequest: {
        body: {
            start: Joi.date().required(),
            end: Joi.date().required(),
            leaveType: Joi.string().required(),
            status: Joi.string().required()
        }
    },
    createHoliday: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            date: Joi.date().required()
        }
    },

    updateHoliday: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            date: Joi.date().required()
        },
        params: {
            holidayId: Joi.string().hex().required()
        }
    },

    updateUser: {
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            holidays: Joi.number().required(),
            position: Joi.string().required(),
            projectId: Joi.string().hex().required(),
            userType: Joi.string().required()
        },
        params: {
            userId: Joi.string().hex().required()
        }
    },

    updateProject: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            roles: Joi.array().items(Joi.string()).required(),
            approvers: Joi.array().items(Joi.string()).required()
        },
        params: {
            projectId: Joi.string().hex().required()
        }
    },

    updateProjectRole: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required()
        }
    },

    login: {
        body: {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    }
};
