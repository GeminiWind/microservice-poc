import * as R from 'ramda';
import JsonApiError, { BadRequestError, InternalError, AggregateJsonApiError } from 'json-api-error';
import { schemaValidator } from '@hai.dinh/service-libraries';
import KcAdminClient from 'keycloak-admin';
import schemas from '../../../resources/schemas';

export function validateRequest(req) {
  const { instrumentation } = req;

  const validator = schemaValidator.compile(schemas.createUserSchema);
  const isValid = validator(req.body);

  if (!isValid) {
    const errors = validator.errors.map(((ajvError) => new BadRequestError({
      detail: `${ajvError.dataPath} ${ajvError.message}`,
      source: {
        pointer: ajvError.dataPath
      }
    })));

    instrumentation.error('Request is invalid', JSON.stringify(validator.errors, null, 2));

    throw new AggregateJsonApiError(errors, 400);
  }

  return req;
}

export async function createUser(req) {
  const { instrumentation } = req;

  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_BASEURL,
    realmName: 'master'
  });

  await kcAdminClient.auth({
    username: 'admin',
    password: 'Pa55w0rd',
    grantType: 'password',
    clientId: 'admin-cli'
  });

  let user;

  try {
    user = await kcAdminClient.users.create({
      realm: process.env.KEYCLOAK_REALM,
      username: R.path(['body', 'data', 'attributes', 'username'], req),
      email: R.path(['body', 'data', 'attributes', 'email'], req),
      firstName: R.path(['body', 'data', 'attributes', 'first_name'], req),
      lastName: R.path(['body', 'data', 'attributes', 'last_name'], req),
      attributes: R.path(['body', 'data', 'attributes', 'attributes'], req),
      enabled: true
    });
  } catch (error) {
    instrumentation.error('Error in creating new user', error);

    throw new InternalError('Error in creating new user');
  }

  return {
    ...req,
    user
  };
}

export async function setPassword(req) {
  const { instrumentation } = req;

  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_BASEURL,
    realmName: 'master'
  });

  await kcAdminClient.auth({
    username: 'admin',
    password: 'Pa55w0rd',
    grantType: 'password',
    clientId: 'admin-cli'
  });

  try {
    await kcAdminClient.users.resetPassword({
      id: req.user.id,
      credential: {
        temporary: false,
        type: 'password',
        value: R.path(['body', 'data', 'attributes', 'password'], req)
      },
      realm: process.env.KEYCLOAK_REALM
    });
  } catch (error) {
    instrumentation.error('Error in setting password for user', error);

    throw new InternalError('Error in setting password for user.');
  }

  return req;
}

export function returnResponse(req) {
  return {
    statusCode: 201,
    body: {
      data: {
        type: 'users',
        attributes: {
          username: R.path(['body', 'data', 'attributes', 'username'], req),
          email: R.path(['body', 'data', 'attributes', 'email'], req),
          firstName: R.path(['body', 'data', 'attributes', 'first_name'], req),
          lastName: R.path(['body', 'data', 'attributes', 'last_name'], req),
          attributes: R.path(['body', 'data', 'attributes', 'attributes'], req)
        }
      }
    }
  };
}

export default R.tryCatch(
  R.pipeP(
    (req) => Promise.resolve(req),
    validateRequest,
    createUser,
    setPassword,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in creating user');
    }
  },
);
