import Audit from '../models/audit.model';
import User from '../models/user.model';

function load(req, res, next, id) {
    Audit.get(id)
        .then((audit) => {
            req.audit = audit;
            next();
            return null;
        })
        .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.audit);
}

async function create(req, res, next) {
    const user = await User.get(req.body.user_id);
    const audit = new Audit({
        author: user._id,
        description: req.body.description
    });

    audit.save()
        .then(savedHoliday => res.json(savedHoliday))
        .catch(e => next(e));
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;

    Audit.list({ limit, skip })
        .then(audits => res.json(audits))
        .catch(e => next(e));
}

export default { load, get, create, list };
