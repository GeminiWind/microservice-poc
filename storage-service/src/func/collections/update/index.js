import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function updateCollection(event) {
  const origin = R.path(['params', 'collection'], event);

  const target = R.path(['body', 'data', 'attributes', 'name'], event) || origin;
  const options = R.path(['body', 'data', 'attributes', 'options'], event);

  const { connector } = event;

  try {
    await connector.renameCollection(origin, target, options);
  } catch (error) {
    console.log(`Error in updating collection '${origin}'`, error);

    throw new InternalError(`Error in creating collection '${origin}'. Try again`);
  }

  return event;
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: {
      data: {
        type: 'collections',
        attributes: R.path(['body', 'data', 'attributes'], event),
      },
    },
  };
}

export default req => Promise.resolve(req)
  .then(updateCollection)
  .then(returnResponse);
