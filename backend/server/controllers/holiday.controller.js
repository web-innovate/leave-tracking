import Holiday from '../models/holiday.model';
import Audit from '../models/audit.model';

function load(req, res, next, id) {
    Holiday.get(id)
        .then((holiday) => {
            req.holiday = holiday;
            next();
            return null;
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
        .then(async savedHoliday => {
            const audit = new Audit({
                author: req.token.id,
                details: `Created Holiday: ${savedHoliday.name}|${savedHoliday.description}(${savedHoliday.date})`
            });
            await audit.save();
            return res.json(savedHoliday);
        })
        .catch(e => next(e));
}

function update(req, res, next) {
    const holiday = req.holiday;
    holiday.name = req.body.name;
    holiday.description = req.body.description;
    holiday.date = req.body.date;


    holiday.save()
        .then(async savedHoliday => {
            const audit = new Audit({
                author: req.token.id,
                details: `Updated Holiday:
                    ${req.body.name}|${req.body.description}|${req.body.date} with
                    ${savedHoliday.name}|${savedHoliday.description}(${savedHoliday.date})`
            });
            await audit.save();
            return res.json(savedHoliday);
        })
        .catch(e => next(e));
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Holiday
    .list({ limit, skip })
        .then(holidays => res.json(holidays))
        .catch(e => next(e));
}

function aggregate(req, res, next) {
    Holiday
    .aggregate([ { $group: {
        _id: { $year: '$date' },
        items: { $push: '$$ROOT' },
        workingDays: {
            $sum: {
                $cond: {
                    if: { $in: [ { $dayOfWeek:{ date:'$date', timezone: 'Europe/Bucharest'} }, {$range: [ 2, 6 ] } ] },
                    then: 1, else: 0
                }
            }
        }}}])
        .then(holidays => res.json(holidays))
        .catch(e => next(e));
}

function remove(req, res, next) {
    const holiday = req.holiday;
    holiday.remove()
        .then(async deletedHoliday => {
            const audit = new Audit({
                author: req.token.id,
                details: `Deleted Holiday:
                    ${deletedHoliday.name}|${deletedHoliday.description}(${deletedHoliday.date})`
            });
            await audit.save();
            return res.json(deletedHoliday);
        })
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove, aggregate };
