import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import leaveCtrl from '../controllers/leave-request.controller';
import expressAuth from '../helpers/ExpressAuth';

const router = express.Router();

const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(leaveCtrl.list)
    .post(validate(paramValidation.createLeaveRequest), leaveCtrl.create);

router.route('/pending')
    .get(leaveCtrl.pending);

router.route('/approved')
    .get(leaveCtrl.approved);

router.route('/rejected')
    .get(leaveCtrl.rejected);

router.route('/:leaveId')
    .get(leaveCtrl.get)
    .put(leaveCtrl.update);

router.param('leaveId', leaveCtrl.load);

export default router;
