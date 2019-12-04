import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { StorageClient } from '@hai.dinh/service-libraries';

const storageClient = new StorageClient();

export default function jwtPassport(passport) {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  };

  passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
    const {
      email,
    } = jwtPayload;

    try {
      const response = await storageClient.get(`users/${email}`);

      if (response.statusCode === 200) {
        const {
          body: {
            Content: {
              password,
              ...userAttributesWithoutPassword
            },
          },
        } = response;

        done(null, {
          ...userAttributesWithoutPassword,
        });
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  }));
}
