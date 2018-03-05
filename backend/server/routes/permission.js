import APIError from '../helpers/APIError';

export default function permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    return (req, res, next) => {
        //user type matches the permit rules or the permit list is empty
        if (req.token && (isAllowed(req.token.userType) || allowed.length == 0)) {
            next(); // role is allowed, so continue on the next middleware
        } else {
            const errorMessage = `Current: '${req.token.userType}', Requires: '${allowed}'`;
            next(new APIError(errorMessage, 403, true));
        }
    };
}
