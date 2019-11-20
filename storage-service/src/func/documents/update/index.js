import { InternalError, NotFoundError } from 'json-api-error';
import * as R from 'ramda';

export async function validateRequest(event) {
  // TODO: validate request

  return event;
}

export async function checkDocumentIsExisting(event) {
  const collectionName = R.path(['params', 'collection'], event);
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let isExisting;

  try {
    const collection = connector.collection(collectionName);

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
  const collectionName = R.path(['params', 'collection'], event);
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let updatedDoc;

  try {
    const collection = connector.collection(collectionName);

    updatedDoc = await collection.findOneAndUpdate(
      {
        _id: documentId,
      }, {
        $set: R.path(['body'], event),
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
    updatedDoc,
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: {
      data: {
        id: event.updatedDoc.value._id, // eslint-disable-line no-underscore-dangle
        type: 'documents',
        attributes: R.omit(['_id'], event.updatedDoc.value),
      },
    },
  };
}

export default req => Promise.resolve(req)
  .then(validateRequest)
  .then(checkDocumentIsExisting)
  .then(updateDocument)
  .then(returnResponse);
