import passport from 'passport';
import { UnauthorizedError } from 'json-api-error';

export default function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false, failWithError: true }, (err, user) => {
    if (err || !user) {
      next(new UnauthorizedError('Unauthorized'));
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
}
