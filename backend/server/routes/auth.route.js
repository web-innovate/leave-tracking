import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/login')
    .post(validate(paramValidation.login), authCtrl.login);

router.route('/random-number')
    .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

router.route('/me')
    .get(expressJwt({ secret: config.jwtSecret }), authCtrl.me);

export default router;
