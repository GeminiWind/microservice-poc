import * as R from 'ramda';
import JsonApiError, { BadRequestError, InternalError } from 'json-api-error';
import { schemaValidator } from '@hai.dinh/service-libraries';
import schemas from '../../resources/schemas';

export function validateRequest(req) {
  const { instrumentation } = req;

  const validator = schemaValidator.compile(schemas.createOrderSchema);
  const isValid = validator(req.body);

  if (!isValid) {
    instrumentation.error('Request is invalid', JSON.stringify(validator.errors, null, 2));

    throw new BadRequestError({
      detail: 'Request is invalid',
      source: validator.errors,
    });
  }

  return req;
}

export async function createOrder(req) {
  const {
    instrumentation,
    storageClient,
    body: {
      data: {
        id,
        attributes,
      },
    },
  } = req;

  const record = {
    Content: {
      ...attributes,
    },
    Type: 'orders',
  };

  try {
    const userEmail = req.headers['x-remote-user'];
    const path = `users/${userEmail}/orders/${id}`;

    await storageClient.create(path, record);
  } catch (error) {
    instrumentation.error(`Error in creating order ${id}.`, error);

    throw new InternalError(`Error in creating order ${id}.`);
  }

  return req;
}

export function returnResponse(req) {
  const {
    body: {
      data: {
        id,
        attributes,
      },
    },
  } = req;

  return {
    statusCode: 201,
    body: {
      data: {
        type: 'orders',
        id,
        attributes,
      },
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    validateRequest,
    createOrder,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in creating order.');
    }
  },
);
