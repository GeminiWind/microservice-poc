import * as R from 'ramda';
import { NotFoundError, BadRequestError, InternalError } from 'json-api-error';
import { Issuer } from 'openid-client';

export async function getTokensFromKeyCloak(req) {
  const refreshToken = R.path(['body', 'data', 'attributes', 'refresh_token'], req);

  const { instrumentation } = req;

  const keycloakIssuer = await Issuer.discover(
    'http://keycloak:8080/auth/realms/microservice',
  );
  
  const client = new keycloakIssuer.Client({
    client_id: 'microservice',
    client_secret: '345482e7-4634-4b9d-b121-8bea96776ba6'
  });

  let response;

  try {
    response = await client.refresh(refreshToken);
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      instrumentation.error('Your refresh_token is invalid.', error);

      throw new BadRequestError('Your refresh_token is invalid.');
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
  getTokensFromKeyCloak,
  returnResponse,
);
