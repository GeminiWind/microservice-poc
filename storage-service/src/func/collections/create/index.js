import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function createCollection(event) {
  const collectionName = R.path(['body', 'data', 'attributes', 'name'], event);
  const connector = R.path(['connector', event]);

  try {
    await connector.createCollection(collectionName);
  } catch (error) {
    console.log(`Error in creating collection '${collectionName}'`, error);

    throw new InternalError(`Error in creating collection '${collectionName}'. Try again`);
  }

  return event;
}

export function returnResponse(event) {
  const collectionName = R.path(['body', 'data', 'attributes', 'name'], event);

  return {
    status: 201,
    body: {
      data: {
        type: 'collections',
        attributes: {
          name: collectionName,
        },
      },
    },
  };
}

export default req => Promise.resolve(req)
  .then(createCollection)
  .then(returnResponse);
