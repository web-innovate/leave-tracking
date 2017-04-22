import LeaveRequest from '../models/leave-request.model';

function load(req, res, next, id) {
  LeaveRequest.get(id)
    .then((leaveRequest) => {
      req.leaveRequest = leaveRequest;
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.user);
}

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

function update(req, res, next) {
  const leave = req.leaveRequest;

  leave.status = req.body.status;

  leave.save()
    .then(savedRequest => res.json(savedRequest))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  LeaveRequest.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function getForUser(req, res, next) {
  const { userId } = req.params;

  LeaveRequest.find({ userId })
    .then(leaves => res.json(leaves))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove, getForUser };
