import * as R from 'ramda';
import { BadRequestError, InternalError } from 'json-api-error';
import { Issuer } from 'openid-client';

export async function getTokensFromKeycloak(req) {
  const username = R.path(['body', 'data', 'attributes', 'username'], req);
  const password = R.path(['body', 'data', 'attributes', 'password'], req);

  const { instrumentation } = req;

  const keycloakIssuer = await Issuer.discover(
    `${process.env.KEYCLOAK_BASEURL}/realms/${process.env.KEYCLOAK_REALM}`,
  );
  
  const client = new keycloakIssuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  });

  let response;

  try {
    response = await client.grant({
      grant_type: 'password',
      username,
      password
    });
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      instrumentation.error('Your account does not exist or invalid.', error);

      throw new BadRequestError('Your account does not exist or invalid.');
    }

    instrumentation.error('Error in generating tokens', error);

    throw new InternalError('Error in generating tokens.');
  }

  return {
    ...req,
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_at: response.expires_at,
    scope: response.scope,
    token_type: response.token_type
  };
}

export function returnResponse(req) {
  return {
    statusCode: 200,
    body: {
      data: {
        type: 'tokens',
        attributes: {
          token_type: req.token_type,
          access_token: req.access_token,
          scope: req.scope,
          expires_at: req.expires_at,
          refresh_token: req.refresh_token
        }
      }
    }
  };
}

export default R.pipeP(
  getTokensFromKeycloak,
  returnResponse,
);
