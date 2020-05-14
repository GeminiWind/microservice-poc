import * as R from 'ramda';
import { BadRequestError, InternalError } from 'json-api-error';
import { Issuer } from 'openid-client';

export async function getUserFromAccessToken(req) {
  const {
    headers: {
      authorization
    },
    instrumentation
  } = req;

  let client;

  try {
    const keycloakIssuer = await Issuer.discover(
      `${process.env.KEYCLOAK_BASEURL}/realms/${process.env.KEYCLOAK_REALM}`,
    );
    
    client = new keycloakIssuer.Client({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    });
  } catch (error) {
    instrumentation.error('Error in connecting to Keycloak', error);

    throw new InternalError('Error in getting user info.');
  }
 

  let user;

  try {
    user = await client.userinfo(authorization.split('Bearer ')[1]);
  } catch (error) {
    if (error.message.includes('invalid_token')) {
      instrumentation.error('Your token is invalid.', error);

      throw new BadRequestError('Your token is invalid.');
    }

    instrumentation.error('Error in getting user info', error);

    throw new InternalError('Error in getting user info.');
  }

  return {
    ...req,
    user
  };
}

export function returnResponse(req) {
  return {
    statusCode: 200,
    body: {},
    headers: {
      'X-Username': req.user.preferred_username
    }
  };
}

export default R.pipeP(
  (req) => Promise.resolve(req),
  getUserFromAccessToken,
  returnResponse,
);
