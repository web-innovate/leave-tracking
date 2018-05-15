import Audit from '../models/audit.model';

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

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;

    Audit.list({ limit, skip })
        .then(audits => res.json(audits))
        .catch(e => next(e));
}

export default { load, get, list };
