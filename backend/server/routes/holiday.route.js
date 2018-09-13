import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import holidayCtrl from '../controllers/holiday.controller';
import expressAuth from '../helpers/ExpressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(), holidayCtrl.list)
    .post(permit(ADMIN), validate(paramValidation.createHoliday), holidayCtrl.create);

router.route('/aggregate')
    .get(permit(ADMIN), holidayCtrl.aggregate);

router.route('/:holidayId')
    .get(permit(), holidayCtrl.get)
    .put(permit(ADMIN), validate(paramValidation.updateHoliday), holidayCtrl.update)
    .delete(permit(ADMIN), holidayCtrl.remove);

router.param('holidayId', holidayCtrl.load);

export default router;
