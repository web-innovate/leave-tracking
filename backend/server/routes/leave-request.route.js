import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import leaveCtrl from '../controllers/leave-request.controller';
import expressJwt from 'express-jwt';
import config from '../../config/config';

const router = express.Router();

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), leaveCtrl.list)
    .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.createLeaveRequest), leaveCtrl.create);

router.route('/:leaveId')
    .get(expressJwt({ secret: config.jwtSecret }), leaveCtrl.get)
    .put(expressJwt({ secret: config.jwtSecret }), leaveCtrl.update);

router.param('leaveId', leaveCtrl.load);

export default router;
