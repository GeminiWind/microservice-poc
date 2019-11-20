import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function createCollection(event) {
  const collection = R.path(['body', 'data', 'attributes', 'name'], event);
  const options = R.path(['body', 'data', 'attributes', 'options'], event);
  const { connector } = event;

  try {
    await connector.createCollection(collection, options);
  } catch (error) {
    console.log(`Error in creating collection '${collection}'`, error);

    throw new InternalError(`Error in creating collection '${collection}'. Try again`);
  }

  return event;
}

export function returnResponse(event) {
  const collectionName = R.path(['body', 'data', 'attributes', 'name'], event);

  return {
    statusCode: 201,
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
