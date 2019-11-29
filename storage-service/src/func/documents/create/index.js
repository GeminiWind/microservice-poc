import * as R from 'ramda';
import JsonApiError, { InternalError } from 'json-api-error';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export function validateDocument(event) {
  // TODO: implement validate mechanism
  return event;
}

export async function createDocument(event) {
  const document = R.path(['body', 'data'], event);
  const { connector } = event;

  let createdDoc;

  try {
    createdDoc = await connector.collection(MAIN_COLLECTION_NAME).insertOne({
      ...R.pick(['Path', 'Content', 'Type', 'Attributes'], document.attributes),
    });
  } catch (error) {
    console.log('Error in inserting document', error);

    throw new InternalError('Error in inserting document. Try again');
  }

  return {
    ...event,
    createdDoc,
  };
}

export function returnResponse(event) {
  const { createdDoc } = event;
  const documentAttributes = R.path(['body', 'data', 'attributes'], event);

  return {
    statusCode: 201,
    body: {
      data: {
        id: createdDoc.insertedId, // eslint-disable-line no-underscore-dangle
        type: 'documents',
        attributes: R.pick(['Path', 'Content', 'Type', 'Attributes'], documentAttributes),
      },
    },
    headers: {
      Accept: 'application/vnd.api+json',
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    validateDocument,
    createDocument,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in inserting document');
    }
  },
);
