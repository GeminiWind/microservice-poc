import { InternalError, NotFoundError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function validateRequest(event) {
  // TODO: validate request

  return event;
}

export async function checkDocumentIsExisting(event) {
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let isExisting;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    isExisting = await collection.findOne({
      _id: documentId,
    });
  } catch (error) {
    throw new InternalError('Error in getting document. Try again');
  }

  if (!isExisting) {
    throw new NotFoundError(`Document with id:${documentId} was not found.`);
  }

  return event;
}

export async function updateDocument(event) {
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let commandResult;
  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    commandResult = await collection.findOneAndUpdate(
      {
        _id: documentId,
      }, {
        $set: R.path(['body', 'data', 'attributes'], event),
      },
      {
        returnOriginal: false,
      },
    );
  } catch (error) {
    console.log('Error in updating document', error);

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

export default req => Promise.resolve(req)
  .then(validateRequest)
  .then(checkDocumentIsExisting)
  .then(updateDocument)
  .then(returnResponse);
