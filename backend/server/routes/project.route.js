import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import projectCtrl from '../controllers/project.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/projects - Get list of project */
  .get(projectCtrl.list)

  /** POST /api/projects - Create new project */
  .post(validate(paramValidation.createProject), projectCtrl.create);

router.route('/:projectId')
  /** GET /api/projects/:projectId - Get user */
  .get(projectCtrl.get)

  /** PUT /api/projects/:projectId - Update user */
  .put(validate(paramValidation.updateProject), projectCtrl.update)

  /** DELETE /api/projects/:projectId - Delete user */
  .delete(projectCtrl.remove);

router.route('/:projectId/users')
  .get(projectCtrl.getUsers);

/** Load user when API with projectId route parameter is hit */
router.param('projectId', projectCtrl.load);

export default router;
