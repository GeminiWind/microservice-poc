import JsonApiError, { NotFoundError, InternalError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function getDocument(event) {
  const path = R.path(['params', 'path'], event);
  const { connector, instrumentation } = event;

  let doc;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    doc = await collection.findOne({
      Path: path
    });
  } catch (error) {
    instrumentation.error(`Error in getting document with Path:"${path}"`, error);

    throw new InternalError('Error in getting document. Try again');
  }

  if (!doc) {
    instrumentation.error(`Document with Path:${path} was not found.`);

    throw new NotFoundError(`Document with Path:${path} was not found.`);
  }

  return {
    ...event,
    doc
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: {
      id: event.doc._id, // eslint-disable-line no-underscore-dangle
      type: 'documents',
      attributes: R.pick(['Path', 'Content', 'Type', 'Attributes'], event.doc)
    }
  };
}

export default R.tryCatch(
  R.pipeP(
    (req) => Promise.resolve(req),
    getDocument,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in reading document');
    }
  },
);
