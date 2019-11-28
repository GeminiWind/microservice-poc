import { InternalError, NotFoundError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function validateRequest(event) {
  // TODO: validate request

  return event;
}

export async function checkDocumentIsExisting(event) {
  const path = R.path(['params', 'path'], event);
  const { connector } = event;

  let isExisting;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    isExisting = await collection.findOne({
      Path: path,
    });
  } catch (error) {
    console.log('Error in getting document', error);

    throw new InternalError('Error in getting document. Try again');
  }

  if (!isExisting) {
    console.log(`Document with Path:"${path}" was not found.`);

    throw new NotFoundError(`Document with Path:"${path}" was not found.`);
  }

  return event;
}

export async function updateDocument(event) {
  const path = R.path(['params', 'path'], event);
  const { connector } = event;

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
