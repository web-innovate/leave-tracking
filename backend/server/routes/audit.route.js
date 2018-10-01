import express from 'express';
import auditCtrl from '../controllers/audit.controller';
import expressAuth from '../helpers/expressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

const { ADMIN } = USER_TYPES;

const router = express.Router();
const { authorize } = expressAuth;

router.use(authorize());

router.route('/')
    .get(permit(ADMIN), auditCtrl.list);

router.route('/:auditId')
    .get(permit(), auditCtrl.get);

router.param('auditId', auditCtrl.load);

export default router;
