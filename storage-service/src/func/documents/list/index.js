import JsonApiError, { InternalError } from 'json-api-error';
import * as R from 'ramda';
import { MAIN_COLLECTION_NAME } from '../../../constants';

export async function listingDocuments(event) {
  const skip = parseInt(R.path(['query', 'skip'], event), 10);
  const limit = parseInt(R.path(['query', 'limit'], event), 10);

  // normalize sort op
  let sort = R.path(['query', 'sort'], event);
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

  let query;
  try {
    // TODO: validate query to prevent injection
    // Query specification in here:  https://docs.mongodb.com/manual/reference/operator/query/
    query = R.pipe(
      decodeURIComponent,
      JSON.parse,
    )(R.pathOr('%7B%7D', ['query', 'query'], event));
  } catch (error) {
    console.log('Error in listing documents', error);

    throw new InternalError('Error in listing documents');
  }

  const { connector } = event;

  let documents;
  try {
    const collection = connector.collection(MAIN_COLLECTION_NAME);
    console.log('Listing records with the following condition', JSON.stringify({
      query,
      skip: skip && skip > 0 ? skip : 0,
      limit: limit && limit > 0 ? limit : 100,
      sort: sort || {},
    }));
    documents = await collection.find(query, {
      skip: skip && skip > 0 ? skip : 0,
      limit: limit && limit > 0 ? limit : 100,
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
        type: 'documents',
        attributes: R.pick(['Path', 'Content', 'Type', 'Attributes'], doc),
      })),
    },
  };
}

export default R.tryCatch(
  R.pipeP(
    req => Promise.resolve(req),
    listingDocuments,
    returnResponse,
  ),
  (e) => {
    if (!(e instanceof JsonApiError)) {
      throw new InternalError('Encounter error in listing document');
    }
  },
);
