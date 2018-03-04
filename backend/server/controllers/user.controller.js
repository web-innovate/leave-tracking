import bcrypt from 'bcrypt';
import User from '../models/user.model';
import worker from '../../worker/worker';
import _ from 'lodash';
import queryHelper from '../helpers/query-support';

function load(req, res, next, id) {
    User.get(id)
        .then((user) => {
            req.user = user;
            next();
            return null;
        })
        .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.user);
}

function create(req, res, next) {
    const {
        startDate,
        firstName,
        lastName,
        email,
        password,
        holidays,
        position,
        projectId,
        daysPerYear,
        userType
    } = req.body;

    const user = new User({
        startDate,
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        holidays,
        position,
        projectId,
        daysPerYear,
        userType
    });

    // hash the password
    user.password = bcrypt.hashSync(password, 10);


    user.save()
        .then(user => {
            // send password in plain text to user
            const hashPassword = user.password;
            user.password = password;

            worker.queueNewUser(user.toObject());

            user.password = hashPassword;
            return user;
        })
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

function update(req, res, next) {
    const user = req.user;

    user.startDate = req.body.startDate;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email.toLowerCase();
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.daysPerYear = req.body.daysPerYear;
    user.holidays = req.body.holidays;
    user.position = req.body.position;
    user.projectId = req.body.projectId;
    user.userType = req.body.userType;

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

function list(req, res, next) {

    const { limit = 50, skip = 0, name, fields, userType } = req.query;

    const queryOptions = {
        limit,
        skip,
        extra: {}
    };

    if (name && fields) {
        queryOptions.extra.$or = computeFilterFields(name, fields);
    }

    if (userType) {
        queryOptions.extra.$and = [
            {
                userType: userType
            }
        ];
    }

    User.list(queryOptions)
        .then(users => res.json(users))
        .catch(e => next(e));
}

function computeFilterFields(name, fields) {
    const escapedName = _.escapeRegExp(name);
    const reg = new RegExp(`${escapedName}`,'i');

    let reqFields;
    if (fields) {
        reqFields = fields.split(',').map(field => {
            const obj = {};

            obj[field] = reg;

            return obj;
        });
    }

    return reqFields;
}

function remove(req, res, next) {
    const user = req.user;
    user.remove()
        .then(deletedUser => res.json(deletedUser))
        .catch(e => next(e));
}

function queryInfo(req, res) {
    const sensitiveFields = ['password'];

    const data = queryHelper.getQueryData(User.schema, sensitiveFields);

    res.json(data);
}

export default { load, get, create, update, list, remove, queryInfo };
