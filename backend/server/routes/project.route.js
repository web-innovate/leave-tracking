import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import projectCtrl from '../controllers/project.controller';

const router = express.Router();

router.route('/')
  .get(projectCtrl.list)
  .post(validate(paramValidation.createProject), projectCtrl.create);

router.route('/:projectId')
  .get(projectCtrl.get)
  .put(validate(paramValidation.updateProject), projectCtrl.update)
  .delete(projectCtrl.remove);

router.route('/:projectId/users')
  .get(projectCtrl.getUsers);

router.param('projectId', projectCtrl.load);

export default router;
