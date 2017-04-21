import Holiday from '../models/holiday.model';

/**
 * Load holiday and append to req.
 */
function load(req, res, next, id) {
  Holiday.get(id)
    .then((holiday) => {
      req.holiday = holiday; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get holiday
 * @returns {Project}
 */
function get(req, res) {
  return res.json(req.holiday);
}

/**
 * Create new holiday
 * @property {string} req.body.name - The project name.
 * @property {string} req.body.description - The project description.
 * @returns {Project}
 */
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

/**
 * Update existing holiday
 * @property {string} req.body.name - The project name.
 * @property {string} req.body.description - The project description.
 * @returns {Project}
 */
function update(req, res, next) {
  const holiday = req.holiday;
  holiday.name = req.body.name;
  holiday.description = req.body.description;
  holiday.date = req.body.date;


  holiday.save()
    .then(savedHoliday => res.json(savedHoliday))
    .catch(e => next(e));
}

/**
 * Get holidays list.
 * @property {number} req.query.skip - Number of projects to be skipped.
 * @property {number} req.query.limit - Limit number of projects to be returned.
 * @returns {Holiday[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Holiday.list({ limit, skip })
    .then(holidays => res.json(holidays))
    .catch(e => next(e));
}

/**
 * Delete holiday.
 * @returns {Holiday}
 */
function remove(req, res, next) {
  const holiday = req.holiday;
  holiday.remove()
    .then(deletedHoliday => res.json(deletedHoliday))
    .catch(e => next(e));
}


export default { load, get, create, update, list, remove };
