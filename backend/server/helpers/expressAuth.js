import expressJwt from 'express-jwt';
import config from '../../config/config';

function authorize() {
    return expressJwt({ secret: config.jwtSecret , requestProperty: 'token' });
}

export default { authorize };
