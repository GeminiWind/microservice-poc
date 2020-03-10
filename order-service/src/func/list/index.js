import * as R from 'ramda';
import JsonApiError, { InternalError } from 'json-api-error';

export async function listOrders(req) {
  const {
    instrumentation,
    storageClient,
  } = req;

  const userEmail = req.headers['x-remote-user'];
  const limit = R.pathOr(30, ['query', 'limit'], req);
  const skip = R.pathOr(0, ['query', 'skip'], req);
  const sort = R.pathOr(undefined, ['query', 'sort'], req);


  let response;

  try {
    response = await storageClient.list({
      query: {
        Path: { $regex: `^users/${userEmail}/orders/.*$` },
      },
      limit,
      skip,
      sort,
    });
  } catch (error) {
    instrumentation.error('Error in listing orders', error);

    throw new InternalError('Error in listing orders.');
  }

  return {
    ...req,
    records: response.body,
  };
}

export function returnResponse(req) {
  const { records } = req;

  return {
    statusCode: 200,
    body: {
      data: R.map(record => ({
        type: 'orders',
        id: record.Path.split('/')[3],
        attributes: record.Content,
      }), records),
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    listOrders,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in listing order.');
    }
  },
);
