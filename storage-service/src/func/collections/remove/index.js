import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function deleteCollection(event) {
  const collection = R.path(['params', 'collection'], event);
  const { connector } = event;

  try {
    await connector.dropCollection(collection);
  } catch (error) {
    console.log(`Error in deleting collection '${collection}'`, error);

    throw new InternalError(`Error in deleting collection '${collection}'. Try again`);
  }

  return event;
}

export function returnResponse() {
  return {
    statusCode: 204,
  };
}

export default req => Promise.resolve(req)
  .then(deleteCollection)
  .then(returnResponse);
