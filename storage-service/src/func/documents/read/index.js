import { NotFoundError, InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function getDocument(event) {
  const collectionName = R.path(['params', 'collectionName'], event);
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let doc;

  try {
    const collection = connector.collection(collectionName);

    doc = await collection.findOne({
      _id: documentId,
    });
  } catch (error) {
    throw new InternalError('Error in getting document. Try again');
  }

  if (!doc) {
    throw new NotFoundError(`Document with id:${documentId} was not found.`);
  }

  return {
    ...event,
    doc,
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: R.path(event.doc),
  };
}

export default req => Promise.resolve(req)
  .then(getDocument)
  .then(returnResponse);
