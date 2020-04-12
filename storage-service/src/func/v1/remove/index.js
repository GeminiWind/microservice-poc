import JsonApiError, { NotFoundError, InternalError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function deleteDocument(event) {
  const path = R.path(['params', 'path'], event);
  const { connector, instrumentation } = event;

  let doc;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    doc = await collection.findOneAndDelete({
      Path: path
    });
  } catch (error) {
    instrumentation.error(`Error in deleting document with Path:${path}`, error);

    throw new InternalError('Error in deleting document. Try again');
  }

  if (!doc) {
    instrumentation.info(`Document with Path:"${path}" was not found.`);

    throw new NotFoundError(`Document with Path:"${path}" was not found.`);
  }

  return event;
}

export function returnResponse() {
  return {
    statusCode: 204
  };
}

export default R.tryCatch(
  R.pipeP(
    (req) => Promise.resolve(req),
    deleteDocument,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in removing document');
    }
  },
);
