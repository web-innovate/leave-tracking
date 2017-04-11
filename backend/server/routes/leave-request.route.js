import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import leaveCtrl from '../controllers/leave-request.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(leaveCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createLeaveRequest), leaveCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(leaveCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), leaveCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(leaveCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('leaveId', leaveCtrl.load);

export default router;
