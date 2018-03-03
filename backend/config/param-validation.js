import Joi from 'joi';

const userValidations = {
    startDate: Joi.date().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    holidays: Joi.number().required(),
    position: Joi.string().allow('').optional(),
    projectId: Joi.string().allow('').hex().optional(),
    userType: Joi.string().required()
};

const projectValidations = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    roles: Joi.array().items(Joi.string()).required(),
    approvers: Joi.array().items(Joi.string()).required()
};

const projectRoleValidations = {
    name: Joi.string().required(),
    description: Joi.string().required()
};

const holidayValidations = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required()
};

const leaveRequestValidations = {
    start: Joi.date().required(),
    end: Joi.date().required(),
    leaveType: Joi.string().required(),
    status: Joi.string().required()
};

const isObjectId = Joi.string().hex().required();

export default {
    createUser: {
        body: userValidations
    },

    updateUser: {
        body: userValidations,
        params: {
            userId: isObjectId
        }
    },

    createProject: {
        body: projectValidations
    },

    updateProject: {
        body: projectValidations,
        params: {
            projectId: isObjectId
        }
    },

    createProjectRole: {
        body: projectRoleValidations
    },

    updateProjectRole: {
        body: projectRoleValidations,
        params: {
            projectRoleId: isObjectId
        }
    },

    createLeaveRequest: {
        body: leaveRequestValidations
    },
    createHoliday: {
        body: holidayValidations
    },

    updateHoliday: {
        body: holidayValidations,
        params: {
            holidayId: isObjectId
        }
    },

    login: {
        body: {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    }
};
