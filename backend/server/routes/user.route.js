import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import leaveCtrl from '../controllers/leave-request.controller';
import expressAuth from '../helpers/expressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;
const router = express.Router();
const { authorize } = expressAuth;


router.use(authorize());

router.route('/')
    .get(permit(ADMIN), userCtrl.list)
    .post(permit(ADMIN), validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
    .get(permit(), userCtrl.get)
    .put(permit(ADMIN), validate(paramValidation.updateUser), userCtrl.update)
    .delete(permit(ADMIN), userCtrl.remove);

router.route('/:userId/leaves')
    .get(permit(), leaveCtrl.getForUser);

router.param('userId', userCtrl.load);


export default router;
