import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      holidays: Joi.number().required(),
      position: Joi.string().required(),
      projectId: Joi.number().required()
    }
  },

  createProject: {
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
      userId: Joi.string().required(),
      status: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
     body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      holidays: Joi.number().required(),
      position: Joi.string().required(),
      projectId: Joi.number().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  updateProject: {
     body: {
      name: Joi.string().required(),
      description: Joi.string().required()
    },
    params: {
      projectId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
