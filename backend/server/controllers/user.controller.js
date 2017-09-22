import User from '../models/user.model';
import worker from '../../worker/worker';
import _ from 'lodash';

function load(req, res, next, id) {
    User.get(id)
    .then((user) => {
        req.user = user;
        return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.user);
}

function create(req, res, next) {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        holidays: req.body.holidays,
        position: req.body.position,
        projectId: req.body.projectId,
        daysPerYear: req.body.daysPerYear,
        userType: req.body.userType
    });

    user.save()
      .then(user => {
          worker.queueNewUser(user.toObject());
          return user;
      })
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
}

function update(req, res, next) {
    const user = req.user;

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email.toLowerCase();
    user.password = req.body.password;
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

    const { limit = 50, skip = 0, name, fields } = req.query;

    const queryOptions = {
        limit,
        skip
    };

    if (name) {
        queryOptions.extra = {
            $or: computeFilterFields(name, fields)
        };
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
            let obj = {};

            obj[field] = reg;

            return obj;
        });
    } else {
        reqFields = [
            { firstName: reg },
            { lastName: reg }
        ];
    }

    return reqFields;
}

function remove(req, res, next) {
    const user = req.user;
    user.remove()
      .then(deletedUser => res.json(deletedUser))
      .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
