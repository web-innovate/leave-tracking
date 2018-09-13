import Project from '../models/project.model';
import User from '../models/user.model';
import APIError from '../helpers/APIError';

function load(req, res, next, id) {
    if (id === 'undefined') {
        next(new APIError('Project id is undefined', 400, true));
        return null;
    }

    Project.findOne({_id: id})
        .populate('roles')
        .then((project) => {
            req.project = project;
            next();
            return null;
        })
        .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.project);
}

async function create(req, res, next) {
    const project = new Project({
        approvers: req.body.approvers,
        roles: req.body.roles,
        name: req.body.name,
        description: req.body.description,
    });

    project.save()
        .then(savedProject => res.json(savedProject))
        .catch(e => next(e));
}

function update(req, res, next) {
    const project = req.project;
    project.approvers = req.body.approvers;
    project.name = req.body.name;
    project.roles = req.body.roles;
    project.description = req.body.description;


    project.save()
        .then(savedProject => res.json(savedProject))
        .catch(e => next(e));
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Project.find()
        .populate('roles')
        .then(projects => res.json(projects))
        .catch(e => next(e));
}

async function remove(req, res, next) {
    const project = req.project;
    const { _id: projectId } = project;

    const assignedUsers = await User.find({ projectId });

    if(assignedUsers && assignedUsers.length > 0) {
        next(new APIError(`Project is assigned to ${assignedUsers.length} users`, 403, true));
    } else {
        project.remove()
            .then(deletedProject => res.json(deletedProject))
            .catch(e => next(e));
    }
}

function getUsers(req, res, next) {
    const { projectId } = req.params;
    if (projectId === 'undefined') {
        next(new APIError('Project id is undefined', 400, true));
        return null;
    }
    User.find({projectId})
        .then(users => res.json(users))
        .catch(e => next(e));
}

async function getApprovers(req, res, next) {
    const { projectId } = req.params;
    const { approvers } = await Project.findOne({ _id: projectId });
    const users = Promise.all(approvers.map(async (approver) => {
        let user = await User.findOne({ _id: approver });
        const noPasswodUser = user.toObject();
        delete noPasswodUser.password;

        return noPasswodUser;
    }));

    users
        .then(result => res.json(result))
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove, getUsers, getApprovers };
