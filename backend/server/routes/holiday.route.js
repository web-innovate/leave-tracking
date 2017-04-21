import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import holidayCtrl from '../controllers/holiday.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/projects - Get list of project */
  .get(holidayCtrl.list)

  /** POST /api/projects - Create new project */
  .post(validate(paramValidation.createHoliday), holidayCtrl.create);

router.route('/:holidayId')
  /** GET /api/projects/:projectId - Get user */
  .get(holidayCtrl.get)

  /** PUT /api/projects/:projectId - Update user */
  .put(validate(paramValidation.updateProject), holidayCtrl.update)

  /** DELETE /api/projects/:projectId - Delete user */
  .delete(holidayCtrl.remove);

/** Load user when API with projectId route parameter is hit */
router.param('holidayId', holidayCtrl.load);

export default router;
