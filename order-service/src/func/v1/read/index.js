import * as R from 'ramda';
import JsonApiError, { NotFoundError, InternalError } from 'json-api-error';

export async function getOrder(req) {
  const {
    instrumentation,
    storageClient,
    params: {
      id,
    },
  } = req;

  const path = `users/${req.headers['x-remote-user']}/orders/${id}`;

  let response;

  try {
    response = await storageClient.get(path);
  } catch (error) {
    instrumentation.error(`Error in getting order "${id}".`, error);

    throw new InternalError(`Error in getting order "${id}".`);
  }

  if (response.statusCode === 404) {
    throw new NotFoundError(`Order ${id} was not found.`);
  }

  return {
    ...req,
    record: response.body,
  };
}

export function returnResponse(req) {
  const { record } = req;

  return {
    statusCode: 200,
    body: {
      data: {
        type: 'orders',
        id: record.Path.split('/')[3],
        attributes: record.Content,
      },
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    getOrder,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in creating order.');
    }
  },
);
