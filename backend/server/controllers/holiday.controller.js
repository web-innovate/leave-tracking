import Holiday from '../models/holiday.model';

function load(req, res, next, id) {
    Holiday.get(id)
    .then((holiday) => {
        req.holiday = holiday;
        return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
    return res.json(req.holiday);
}

function create(req, res, next) {
    const holiday = new Holiday({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
    });

    holiday.save()
    .then(savedHoliday => res.json(savedHoliday))
    .catch(e => next(e));
}

function update(req, res, next) {
    const holiday = req.holiday;
    holiday.name = req.body.name;
    holiday.description = req.body.description;
    holiday.date = req.body.date;


    holiday.save()
    .then(savedHoliday => res.json(savedHoliday))
    .catch(e => next(e));
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Holiday.list({ limit, skip })
    .then(holidays => res.json(holidays))
    .catch(e => next(e));
}

function remove(req, res, next) {
    const holiday = req.holiday;
    holiday.remove()
    .then(deletedHoliday => res.json(deletedHoliday))
    .catch(e => next(e));
}


export default { load, get, create, update, list, remove };
