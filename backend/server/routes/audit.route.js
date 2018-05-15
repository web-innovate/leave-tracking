import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import auditCtrl from '../controllers/audit.controller';
import expressAuth from '../helpers/ExpressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(ADMIN), auditCtrl.list)

export default router;
