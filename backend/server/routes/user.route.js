import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import leaveCtrl from '../controllers/leave-request.controller';
import expressAuth from '../helpers/ExpressAuth';

const router = express.Router();
const { authorize } = expressAuth;


router.route('/queryInfo')
    .get(userCtrl.queryInfo)

router.use(authorize());

router.route('/')
    .get(userCtrl.list)
    .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
    .get(userCtrl.get)
    .put(validate(paramValidation.updateUser), userCtrl.update)
    .delete(userCtrl.remove);

router.route('/:userId/leaves')
    .get(leaveCtrl.getForUser);

router.param('userId', userCtrl.load);

export default router;
