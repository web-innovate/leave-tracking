import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import projectRoleCtrl from '../controllers/project-role.controller';
import expressAuth from '../helpers/expressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(ADMIN), projectRoleCtrl.list)
    .post(permit(ADMIN), validate(paramValidation.createProjectRole), projectRoleCtrl.create);

router.route('/:projectRoleId')
    .get(permit(), projectRoleCtrl.get)
    .put(permit(ADMIN), validate(paramValidation.updateProjectRole), projectRoleCtrl.update)
    .delete(permit(ADMIN), projectRoleCtrl.remove);

router.param('projectRoleId', projectRoleCtrl.load);

export default router;
