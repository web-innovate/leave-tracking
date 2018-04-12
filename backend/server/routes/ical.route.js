import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import icalCtrl from '../controllers/ical.controller';
// import expressAuth from '../helpers/ExpressAuth';
import permit from './permission';
import { USER_TYPES } from '../helpers/constants';

// const { ADMIN } = USER_TYPES;

const router = express.Router();
// const { authorize } = expressAuth;

// router.use(authorize());

router.route('/')
    .get(icalCtrl.list);

export default router;
