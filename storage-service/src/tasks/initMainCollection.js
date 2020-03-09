import { InternalError } from 'json-api-error';

const initMainCollection = async (connector, collection, options = {}) => {
  try {
    // Create main collection
    await connector.createCollection(collection, options);

    // Create index `Path` in main collection
    await connector.collection(collection).createIndex('Path', {
      unique: true,
    });

    // Create index `expiredAt` to at TTL record
    await connector.collection(collection).createIndex({ 'Attributes.expiredAt': 1 }, {
      expireAfterSeconds: 0,
    });
  } catch (err) {
    console.log('Error in initializing main collection', err);

    throw new InternalError('Error in initializing main collection');
  }
};

export default initMainCollection;
