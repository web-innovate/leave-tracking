import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import projectCtrl from '../controllers/project.controller';
import expressAuth from '../helpers/expressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(ADMIN), projectCtrl.list)
    .post(permit(ADMIN), validate(paramValidation.createProject), projectCtrl.create);

router.route('/:projectId')
    .get(permit(), projectCtrl.get)
    .put(permit(ADMIN), validate(paramValidation.updateProject), projectCtrl.update)
    .delete(permit(ADMIN), projectCtrl.remove);

router.route('/:projectId/users')
    .get(permit(ADMIN), projectCtrl.getUsers);

router.param('projectId', projectCtrl.load);

export default router;
