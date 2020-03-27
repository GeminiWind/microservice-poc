import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { StorageClient } from '@hai.dinh/service-libraries';
import path from 'path';
import readFile from './readFile';

export default async function jwtPassport(passport) {
  const storageClient = await StorageClient.create();

  const publicKey = readFile(path.resolve(__dirname, '../../auth_service_rsa.pub'));

  const options = {
    algorithm: ['RS256'],
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
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
