import path from 'path';
import fs from 'fs-extra';
import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function listServices(event) {
  let services;

  try {
    services = await fs.readJSON(path.resolve(__dirname, '../../../../services.json'));
  } catch (err) {
    console.log('Error in listing service', err);

    throw new InternalError('Error in listing service. Please try again.');
  }

  return {
    ...event,
    services,
  };
}

export function returnResponse(event) {
  return {
    statusCode: 200,
    body: R.map(
      serviceId => ({
        id: serviceId,
        type: 'services',
        attributes: event.services[serviceId],
      }),
      R.keys(event.services),
    ),
  };
}


export default event => Promise.resolve(event)
  .then(listServices)
  .then(returnResponse);
