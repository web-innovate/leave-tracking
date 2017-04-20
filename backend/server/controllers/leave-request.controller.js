import LeaveRequest from '../models/leave-request.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  LeaveRequest.get(id)
    .then((leaveRequest) => {
      req.leaveRequest = leaveRequest; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = req.user;
  const leave = new LeaveRequest(
  {
    start: req.body.start,
    end: req.body.end,
    leaveType: req.body.leaveType,
    userId: user.id,
    status: req.body.status,
    workDays: req.body.workDays
  });

  leave.save()
    .then(savedLeave => res.json(savedLeave))
    .catch(e => next(e));
}

/**
 * Update existing request
 * @returns {LeaveRequest}
 */
function update(req, res, next) {
  const leave = req.leaveRequest;

  leave.status = req.body.status;

  leave.save()
    .then(savedRequest => res.json(savedRequest))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  LeaveRequest.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
