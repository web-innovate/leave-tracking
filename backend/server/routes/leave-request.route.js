import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import leaveCtrl from '../controllers/leave-request.controller';
import expressJwt from 'express-jwt';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), leaveCtrl.list)

  /** POST /api/users - Create new user */
  .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.createLeaveRequest), leaveCtrl.create);

router.route('/:leaveId')
  /** GET /api/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), leaveCtrl.get)

  /** PUT /api/leaves/:leaveId - Update Leave */
  .put(expressJwt({ secret: config.jwtSecret }), leaveCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({ secret: config.jwtSecret }), leaveCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('leaveId', leaveCtrl.load);

export default router;
