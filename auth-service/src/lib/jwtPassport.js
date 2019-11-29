import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import storageLibrary from './storageLibrary';

export default function jwtPassport(passport) {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_KEY,
  };

  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    const {
      email,
    } = jwtPayload;

    storageLibrary.get({
      Path: `users/${email}`,
    }).then((record) => {
      if (record) {
        const {
          Content: {
            password,
            ...userAttributesWithoutPassword
          },
        } = record;
        done(null, {
          ...userAttributesWithoutPassword,
        });
      } else done(null, false);
    }).catch(error => done(error, false));
  }));
}
