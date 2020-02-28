import * as R from 'ramda';
import JsonApiError, { InternalError } from 'json-api-error';

export async function listOrders(req) {
  const {
    instrumentation,
    storageClient,
  } = req;


  let response;

  try {
    const userEmail = req.headers['x-remote-user'];

    // FIXME: regrex for path does not work correctly. Please fix it
    response = await storageClient.list({
      query: {
        Path: { $regex: new RegExp(`^users\/${userEmail}\/orders\/*$`) },
        Type: {
          $eq: 'orders',
        },
      },
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
      data: records.map(record => ({
        type: 'orders',
        id: record.Path.split('/')[3],
        attributes: record.Content,
      })),
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
