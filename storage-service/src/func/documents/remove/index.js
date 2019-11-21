import { NotFoundError, InternalError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function deleteDocument(event) {
  const documentId = R.path(['params', 'id'], event);
  const { connector } = event;

  let doc;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    doc = await collection.findOneAndDelete({
      _id: documentId,
    });
  } catch (error) {
    throw new InternalError('Error in deleting document. Try again');
  }

  if (!doc) {
    throw new NotFoundError(`Document with id:${documentId} was not found.`);
  }

  return event;
}

export function returnResponse() {
  return {
    statusCode: 204,
  };
}

export default req => Promise.resolve(req)
  .then(deleteDocument)
  .then(returnResponse);
