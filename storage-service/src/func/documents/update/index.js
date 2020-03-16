import JsonApiError, { InternalError, NotFoundError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function validateRequest(event) {
  // TODO: validate request

  return event;
}

export async function checkDocumentIsExisting(event) {
  const path = R.path(['params', 'path'], event);
  const { connector, instrumentation } = event;

  let isExisting;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    isExisting = await collection.findOne({
      Path: path,
    });
  } catch (error) {
    instrumentation.error(`Error in getting document with Path:"${path}"`, error);

    throw new InternalError('Error in getting document. Try again');
  }

  if (!isExisting) {
    instrumentation.error(`Document with Path:"${path}" was not found.`);

    throw new NotFoundError(`Document with Path:"${path}" was not found.`);
  }

  return event;
}

export async function updateDocument(event) {
  const path = R.path(['params', 'path'], event);
  const { connector, instrumentation } = event;

  let commandResult;
  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    commandResult = await collection.findOneAndUpdate(
      {
        Path: path,
      }, {
        $set: R.path(['body', 'data', 'attributes'], event),
      },
      {
        returnOriginal: false,
      },
    );
  } catch (error) {
    instrumentation.error(`Error in updating document with Path:"${path}"`, error);

    throw new InternalError('Error in updating document. Try again');
  }

  return {
    ...event,
    document: commandResult.value,
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: {
      data: {
        id: event.document._id, // eslint-disable-line no-underscore-dangle
        type: 'documents',
        attributes: R.pick(['Path', 'Content', 'Type', 'Attributes'], event.document),
      },
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    validateRequest,
    checkDocumentIsExisting,
    updateDocument,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in updating document');
    }
  },
);
