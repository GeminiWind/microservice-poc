import bcrypt from 'bcrypt';
import * as R from 'ramda';
import JsonApiError, { BadRequestError, InternalError, AggregateJsonApiError } from 'json-api-error';
import { schemaValidator } from '@hai.dinh/service-libraries';
import { SALT_ROUND } from '../../../constants';
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

export async function isUserEmailExist(req) {
  const {
    instrumentation,
    storageClient,
    body: {
      data: {
        attributes: {
          email
        }
      }
    }
  } = req;

  const res = await storageClient.get(`users/${email}`);

  if (res.statusCode === 200) {
    instrumentation.error(`User with ${email} already exist`);

    throw new BadRequestError('Your account is already existing or invalid.');
  }

  return req;
}

export async function createUser(req) {
  const {
    instrumentation,
    storageClient,
    body: {
      data: {
        attributes
      }
    }
  } = req;

  const salt = bcrypt.genSaltSync(SALT_ROUND);
  const hashedPassword = bcrypt.hashSync(attributes.password, salt);

  const record = {
    Content: {
      email: attributes.email,
      password: hashedPassword
    },
    Type: 'users'
  };

  try {
    const path = `users/${attributes.email}`;

    await storageClient.create(path, record);
  } catch (error) {
    instrumentation.error('Error in creating user.', error);

    throw new InternalError('Error in creating user.');
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
          email: req.body.data.attributes.email
        }
      }
    }
  };
}

export default R.tryCatch(
  R.pipeP(
    (req) => Promise.resolve(req),
    validateRequest,
    isUserEmailExist,
    createUser,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in creating user');
    }
  },
);
