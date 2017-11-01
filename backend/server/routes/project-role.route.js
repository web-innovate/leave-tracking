import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import projectRoleCtrl from '../controllers/project-role.controller';
import expressAuth from '../helpers/ExpressAuth';

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(projectRoleCtrl.list)
    .post(validate(paramValidation.createProjectRole), projectRoleCtrl.create);

router.route('/:projectRoleId')
    .get(projectRoleCtrl.get)
    .put(validate(paramValidation.updateProjectRole), projectRoleCtrl.update)
    .delete(projectRoleCtrl.remove);

router.param('projectRoleId', projectRoleCtrl.load);

export default router;
