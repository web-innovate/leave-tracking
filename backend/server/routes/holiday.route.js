import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import holidayCtrl from '../controllers/holiday.controller';
import expressAuth from '../helpers/ExpressAuth';

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(holidayCtrl.list)
    .post(validate(paramValidation.createHoliday), holidayCtrl.create);

router.route('/:holidayId')
    .get(holidayCtrl.get)
    .put(validate(paramValidation.updateHoliday), holidayCtrl.update)
    .delete(holidayCtrl.remove);

router.param('holidayId', holidayCtrl.load);

export default router;
