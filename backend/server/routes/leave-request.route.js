import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import leaveCtrl from '../controllers/leave-request.controller';
import expressAuth from '../helpers/expressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN, APPROVER, USER } = USER_TYPES;

const router = express.Router();

const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(), leaveCtrl.list)
    .post(permit(), validate(paramValidation.createLeaveRequest), leaveCtrl.create);

router.route('/pending')
    .get(permit(APPROVER, ADMIN), leaveCtrl.pending);

router.route('/approved')
    .get(permit(APPROVER, ADMIN), leaveCtrl.approved);

router.route('/rejected')
    .get(permit(APPROVER, ADMIN), leaveCtrl.rejected);

router.route('/:leaveId')
    .get(permit(), leaveCtrl.get)
    .put(permit(), leaveCtrl.update)
    .patch(permit(APPROVER, ADMIN), leaveCtrl.updateStatus)
    .delete(permit(), leaveCtrl.remove);

router.param('leaveId', leaveCtrl.load);

export default router;
