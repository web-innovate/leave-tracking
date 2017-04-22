import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import leaveCtrl from '../controllers/leave-request.controller';
import expressJwt from 'express-jwt';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(userCtrl.get)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove);

router.route('/:userId/leaves')
  .get(expressJwt({ secret: config.jwtSecret }), leaveCtrl.getForUser)

router.param('userId', userCtrl.load);

export default router;
