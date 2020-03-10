import * as R from 'ramda';
import JsonApiError, { NotFoundError, InternalError } from 'json-api-error';

export async function checkExistingOrder(req) {
  const {
    instrumentation,
    storageClient,
  } = req;

  const userEmail = req.headers['x-remote-user'];
  const orderId = R.path(['params', 'id'], req);
  const path = `users/${userEmail}/orders/${orderId}`;

  let response;

  try {
    response = await storageClient.get(path);
  } catch (error) {
    instrumentation.error(`Error in getting order "${orderId}".`, error);

    throw new InternalError(`Error in getting order "${orderId}".`);
  }

  if (response.statusCode === 404) {
    throw new NotFoundError(`Order ${orderId} was not found`);
  }

  return req;
}

export async function deleteOrder(req) {
  const {
    instrumentation,
    storageClient,
  } = req;

  const userEmail = req.headers['x-remote-user'];
  const orderId = R.path(['params', 'id'], req);
  const path = `users/${userEmail}/orders/${orderId}`;

  try {
    await storageClient.delete(path);
  } catch (error) {
    instrumentation.error(`Error in deleting order "${orderId}".`, error);

    throw new InternalError(`Error in deleting order "${orderId}".`);
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
