import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function listingDocuments(event) {
  const collectionName = R.path(['params', 'collection'], event);

  const skip = parseInt(R.path(['query', 'skip'], event), 10);
  const limit = parseInt(R.path(['query', 'limit'], event), 10);

  let sort = R.path(['query', 'sort'], event);
  // normalize sort op
  if (sort) {
    sort = sort.split(',').reduce((acc, sortField) => {
      if (sortField.startsWith('-')) {
        acc[sortField] = -1;
      } else {
        acc[sortField] = 1;
      }

      return acc;
    }, {});
  }

  let query = {};

  if (R.path(['query', 'query'], event)) {
    try {
      // TODO: validate query to prevent injection
      // Query specification in here:  https://docs.mongodb.com/manual/reference/operator/query/
      query = JSON.parse(R.path(['query', 'query'], event));
    } catch (error) {
      console.log('Error in listing documents', error);

      throw new InternalError('Error in listing documents');
    }
  }


  const { connector } = event;

  let documents;
  try {
    const collection = connector.collection(collectionName);
    documents = await collection.find(query, {
      skip: skip && skip > 0 ? skip : 0,
      limit: limit && limit > 0 ? limit : 0,
      sort: sort || {},
    }).toArray();
  } catch (err) {
    console.log('Error in listing documents', err);

    throw new InternalError('Error in listing documents');
  }

  return {
    ...event,
    documents,
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: {
      data: event.documents.map(doc => ({
        id: doc._id, // eslint-disable-line no-underscore-dangle
        ...R.omit(['_id'], doc),
      })),
    },
  };
}

export default req => Promise.resolve(req)
  .then(listingDocuments)
  .then(returnResponse);
