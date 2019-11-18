import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function deleteCollection(event) {
  const collectionName = R.path(['params', 'collectionName'], event);
  const connector = R.path(['connector', event]);

  try {
    await connector.dropCollection(collectionName);
  } catch (error) {
    throw new InternalError(`Error in deleting collection '${collectionName}'. Try again`);
  }

  return event;
}

export function returnResponse() {
  return {
    status: 204,
  };
}

export default req => Promise.resolve(req)
  .then(deleteCollection)
  .then(returnResponse);
