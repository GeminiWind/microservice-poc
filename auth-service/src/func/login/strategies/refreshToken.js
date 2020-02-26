import jwt from 'jsonwebtoken';
import * as R from 'ramda';
import { NotFoundError } from 'json-api-error';
import { generateToken } from '../helpers';
import { EXPIRY_ACCESS_TOKEN } from '../../../constants';

export function extractRefreshToken(req) {
  const refreshToken = R.path(['query', 'refresh_token'], req);

  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
  const email = R.path(['email'], decoded);

  return Promise.resolve({
    ...req,
    email,
    refreshToken,
  });
}

export async function getUserByEmail(req) {
  const {
    instrumentation,
    storageClient,
    email,
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

export async function generateTokens(req) {
  const {
    user,
    refreshToken,
  } = req;

  // access token should contain both authorization and authentication
  const accessToken = generateToken(
    {
      email: user.email,
      sub: user.email,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: `${EXPIRY_ACCESS_TOKEN}m`,
    },
  );

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
  extractRefreshToken,
  getUserByEmail,
  generateTokens,
  returnResponse,
);
