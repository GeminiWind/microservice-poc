import * as R from 'ramda';
import JsonApiError, { NotFoundError, InternalError } from 'json-api-error';

export async function checkExistingOrder(req) {
  const {
    instrumentation,
    storageClient,
    params: {
      id,
    },
  } = req;


  let response;

  try {
    const userEmail = req.headers['x-remote-user'];
    const path = `users/${userEmail}/orders/${id}`;

    response = await storageClient.get(path);
  } catch (error) {
    instrumentation.error(`Error in getting order "${id}".`, error);

    throw new InternalError(`Error in getting order "${id}".`);
  }

  if (response.statusCode === 404) {
    throw new NotFoundError(`Order ${id} was not found`);
  }

  return req;
}

export async function deleteOrder(req) {
  const {
    instrumentation,
    storageClient,
    params: {
      id,
    },
  } = req;


  try {
    const userEmail = req.headers['x-remote-user'];
    const path = `users/${userEmail}/orders/${id}`;

    await storageClient.delete(path);
  } catch (error) {
    instrumentation.error(`Error in deleting order "${id}".`, error);

    throw new InternalError(`Error in deleting order "${id}".`);
  }


  return req;
}

export function returnResponse() {
  return {
    statusCode: 204,
    body: {},
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    checkExistingOrder,
    deleteOrder,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in deleting order.');
    }
  },
);
