import * as R from 'ramda';
import { NotFoundError, BadRequestError, InternalError } from 'json-api-error';
import path from 'path';
import { readFile } from '../../../../lib';
import { generateToken } from '../helpers';
import { EXPIRY_ACCESS_TOKEN } from '../../../../constants';

export async function extractRefreshToken(req) {
  const refreshToken = R.path(['query', 'refresh_token'], req);
  const { storageClient, instrumentation } = req;

  let response;

  try {
    response = await storageClient.get(`refresh-tokens/${refreshToken}`);
  } catch (error) {
    instrumentation.error(`Error in getting refreshToken "${refreshToken}".`, error);

    throw new InternalError('Error in handling refresh token');
  }

  if (response.statusCode === 404) {
    throw new BadRequestError(`Refresh token ${refreshToken} was invalid`);
  }

  return Promise.resolve({
    ...req,
    email: response.body.Content.user.email,
    refreshToken
  });
}

export async function getUserByEmail(req) {
  const {
    instrumentation,
    storageClient,
    email
  } = req;

  const res = await storageClient.get(`users/${email}`);

  if (res.statusCode === 404) {
    instrumentation.error('Your account does not exist.');

    throw new NotFoundError('Your account does not exist or invalid.');
  }

  return {
    ...req,
    user: res.body.Content
  };
}

export async function generateTokens(req) {
  const {
    user,
    refreshToken
  } = req;

  const privateKey = readFile(path.resolve(__dirname, '../../../../../auth_service_rsa'));

  // access token should contain both authorization and authentication
  const accessToken = generateToken(
    {
      email: user.email,
      sub: user.email
    },
    privateKey,
    {
      expiresIn: `${EXPIRY_ACCESS_TOKEN}m`,
      algorithm: 'RS256'
    },
  );

  return {
    ...req,
    accessToken,
    refreshToken,
    expiresIn: EXPIRY_ACCESS_TOKEN * 60
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
          token_type: 'Bearer'
        }
      }
    }
  };
}

export default R.pipeP(
  extractRefreshToken,
  getUserByEmail,
  generateTokens,
  returnResponse,
);
