import * as R from 'ramda';
import { InternalError } from 'json-api-error';

export function validateDocument(event) {
  // TODO: implement validate mechanism
  return event;
}

export async function createDocument(event) {
  const collection = R.path(['params', 'collection'], event);
  const document = R.path(['body'], event);
  const { connector } = event;

  let createdDoc;

  try {
    createdDoc = await connector.collection(collection).insertOne({
      _id: document.id || document._id, // eslint-disable-line no-underscore-dangle
      ...R.omit(['id', '_id'], document),
    });
  } catch (error) {
    console.log('Error in inserting document', error);

    throw new InternalError('Error in inserting document. Try again');
  }

  return {
    ...event,
    createdDoc,
  };
}

export function returnResponse(event) {
  const { createdDoc } = event;
  const document = R.path(['body'], event);

  return {
    statusCode: 201,
    body: {
      data: {
        id: createdDoc.insertedId, // eslint-disable-line no-underscore-dangle
        type: 'documents',
        attributes: R.omit(['id', '_id'], document),
      },
    },
  };
}

export default req => Promise.resolve(req)
  .then(validateDocument)
  .then(createDocument)
  .then(returnResponse);
