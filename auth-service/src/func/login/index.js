import jwt from 'jsonwebtoken';
import moment from 'moment';
import randToken from 'rand-token';
import isMatchingWithHashedPassword from './helpers/isMatchingWithHashedPassword';
import { NotFoundError, BadRequestError } from 'json-api-error';
import { PASSWORD_GRANT_TYPE, REFRESH_TOKEN_GRANT_TYPE } from '../../constants';

export function validateRequest(req) {
  // const { schemaValidator, instrumentation } = req;
  // const isValid = schemaValidator.validate('https://heligram.com/login-user+v1.json', req.body);

  // if (!isValid) {
  //   instrumentation.error('Error in validate request %s', JSON.stringify(schemaValidator.errors, null, 2));

  //   throw new BadRequestError({
  //     source: schemaValidator.errors,
  //   });
  // }

  return req;
}

export async function getUserByEmail(req) {
  const {
    instrumentation,
    storageClient,
    body: {
      data: {
        attributes: {
          email,
        },
      },
    },
  } = req;

  const res = await storageClient.get(`users/${email}`);

  if (res.statusCode === 404) {
    instrumentation.error('Your account does not exist.');

    throw new NotFoundError(`Your account does not exist or invalid.`);
  }

  return {
    ...req,
    user: res.body.Content,
  };
}

export function verifyPassword(req) {
  const {
    instrumentation,
    user,
  } = req;

  if (!isMatchingWithHashedPassword(req.body.data.attributes.password, user.password)) {
    instrumentation.error('Password does not match');

    throw new BadRequestError('Your account does not exist or invalid.');
  }

  return req;
}

export async function generateAccessToken(req) {
  const {
    user,
    cache,
  } = req;

  // generate token
  const token = jwt.sign(
    {
      email: user.email,
      sub: user.email,
    },
    process.env.APP_KEY,
    {
      expiresIn: '30m',
    },
  );

  const expireAt = moment().add(30, 'm').unix();

  const refreshToken = randToken.generate(16);

  // store refreshToken in cache in 6 month
  // await cache.set(refreshToken, JSON.stringify({
  //   email: user.email,
  // }), 'EX', 15552000);

  return {
    ...req,
    accessToken: `Bearer ${token}`,
    expireAt,
    refreshToken,
  };
}

export async function verifyRefreshToken(req) {
  const {
    cache,
    body: { data: { attributes: { refreshToken } } },
  } = req;

  const isRefreshTokenValid = await cache.get(refreshToken);

  if (!isRefreshTokenValid) {
    throw new BadRequestError('Refresh token is invalid.');
  }

  return req;
}

export async function exchangeRefreshTokenToAccessToken(req) {
  const {
    storageLibrary,
    instrumentation,
    cache,
    body: { data: { attributes: { refreshToken } } },
  } = req;

  const cacheValue = await cache.get(refreshToken);
  const { email } = JSON.parse(cacheValue);

  const { user } = await getUserByEmail({
    storageLibrary,
    instrumentation,
    body: {
      data: {
        attributes: {
          email,
        },
      },
    },
  });

  // generate token
  const token = jwt.sign(
    {
      email: user.email,
      sub: user.email,
    },
    process.env.APP_KEY,
    {
      expiresIn: '30m',
    },
  );

  const expireAt = moment().add(30, 'm').unix();

  return {
    ...req,
    accessToken: `Bearer ${token}`,
    expireAt,
    refreshToken,
  };
}

export function returnResponse(req) {
  return {
    statusCode: 200,
    body: {
      data: {
        type: 'tokens',
        attributes: {
          accessToken: req.accessToken,
          refreshToken: req.refreshToken,
          expireAt: req.expireAt,
        },
      },
    },
  };
}

const handlePasswordGrantType = req => Promise.resolve(req)
  .then(getUserByEmail)
  .then(verifyPassword)
  .then(generateAccessToken);


const handleRefreshGrantType = req => Promise.resolve(req)
  .then(verifyRefreshToken)
  .then(exchangeRefreshTokenToAccessToken);

export default req => Promise.resolve(req)
  .then(validateRequest)
  .then((state) => {
    const {
      body: {
        data: {
          attributes: {
            grantType,
          },
        },
      },
    } = state;

    if (grantType === PASSWORD_GRANT_TYPE) return handlePasswordGrantType(state);
    if (grantType === REFRESH_TOKEN_GRANT_TYPE) return handleRefreshGrantType(state);
    return state;
  })
  .then(returnResponse);
