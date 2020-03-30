import * as R from 'ramda';
import moment from 'moment';
import { NotFoundError, BadRequestError, InternalError } from 'json-api-error';
import crypto from 'crypto';
import path from 'path';
import { readFile } from '../../../../lib';
import { generateToken, isMatchingWithHashedPassword } from '../helpers';
import { EXPIRY_ACCESS_TOKEN, EXPIRY_REFRESH_TOKEN } from '../../../../constants';

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

    throw new NotFoundError('Your account does not exist or invalid.');
  }

  return {
    ...req,
    user: res.body.Content,
  };
}

export function verifyPassword(req) {
  const { instrumentation } = req;

  const plainPassword = R.path(['body', 'data', 'attributes', 'password'], req);
  const hashedPassword = R.path(['user', 'password'], req);

  if (!isMatchingWithHashedPassword(plainPassword, hashedPassword)) {
    instrumentation.error('Password does not match');

    throw new BadRequestError('Your account does not exist or invalid.');
  }

  return req;
}

export async function generateTokens(req) {
  const {
    user,
    storageClient,
    instrumentation,
  } = req;

  const privateKey = readFile(path.resolve(__dirname, '../../../../../auth_service_rsa'));

  // access token should contain both authorization and authentication
  const accessToken = generateToken(
    {
      email: user.email,
      sub: user.email,
    },
    privateKey,
    {
      expiresIn: `${EXPIRY_ACCESS_TOKEN}m`,
      algorithm: 'RS256',
    },
  );

  // refresh token should only contain authorization
  // and live longer than access token
  let refreshToken;
  try {
    refreshToken = crypto.randomBytes(64).toString('hex');
    // create TTL record for refresh token
    await storageClient.create(`refresh-tokens/${refreshToken}`, {
      Attributes: {
        expiredAt: moment().add(EXPIRY_REFRESH_TOKEN, 'm').toDate(),
      },
      Content: {
        user: {
          email: user.email,
        },
        isEnable: 'true',
      },
      Type: 'refresh-tokens',
    });
  } catch (error) {
    instrumentation.error('Error in generating refresh token', error);

    throw new InternalError('Error in generating tokens');
  }

  return {
    ...req,
    accessToken,
    refreshToken,
    expiresIn: EXPIRY_ACCESS_TOKEN * 60,
  };
}

export function returnResponse(req) {
  return {
    statusCode: 200,
    body: {
      data: {
        type: 'tokens',
        attributes: {
          access_token: req.accessToken,
          refresh_token: req.refreshToken,
          expires_in: req.expiresIn,
          token_type: 'Bearer',
        },
      },
    },
  };
}

export default R.pipeP(
  getUserByEmail,
  verifyPassword,
  generateTokens,
  returnResponse,
);
