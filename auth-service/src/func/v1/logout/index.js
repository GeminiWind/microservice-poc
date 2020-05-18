import * as R from 'ramda';
import { InternalError } from 'json-api-error';
import { Issuer } from 'openid-client';

export async function logout(req) {
  const refreshToken = R.path(['body', 'data', 'attributes', 'refresh_token'], req);
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
 
  try {
    await client.requestResource(
      `${process.env.KEYCLOAK_BASEURL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      authorization.split('Bearer ')[1],
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET
        })
      }
    );
  } catch (error) {
    instrumentation.error('Error in logging out', error);

    throw new InternalError('Error in logging out.');
  }
}

export function returnResponse() {
  return {
    statusCode: 204,
    body: {}
  };
}

export default R.pipeP(
  (req) => Promise.resolve(req),
  logout,
  returnResponse,
);
