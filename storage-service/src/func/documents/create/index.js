import * as R from 'ramda';
import { InternalError } from 'json-api-error';

export function validateDocument(event) {
  // TODO: implement validate mechanism
  return event;
}

export async function createDocument(event) {
  const collectionName = R.path(['params', 'collectionName'], event);
  const document = R.path(['body'], event);
  const { connector } = event;

  try {
    await connector.collection(collectionName).insertOne(document);
  } catch (error) {
    console.log('Error in inserting document', error);

    throw new InternalError('Error in inserting document. Try again');
  }

  return event;
}

export function returnResponse(event) {
  return {
    statusCode: 201,
  };
}

export default req => Promise.resolve(req)
  .then(validateDocument)
  .then(createDocument)
  .then(returnResponse);
