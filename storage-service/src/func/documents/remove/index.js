import { NotFoundError, InternalError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function deleteDocument(event) {
  const path = R.path(['params', 'path'], event);
  const { connector } = event;

  let doc;

  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);

    doc = await collection.findOneAndDelete({
      Path: path,
    });
  } catch (error) {
    throw new InternalError('Error in deleting document. Try again');
  }

  if (!doc) {
    throw new NotFoundError(`Document with Path:"${path}" was not found.`);
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
