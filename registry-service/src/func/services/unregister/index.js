import fs from 'fs-extra';
import { InternalError } from 'json-api-error';
import path from 'path';
import * as R from 'ramda';

export async function unregisterService(event) {
  const serviceId = R.path(['params', 'serviceId'], event);

  try {
    const currentServices = await fs.readJSON(path.resolve(__dirname, '../../../../services.json'));

    // delete services
    const nextServices = R.omit([serviceId], currentServices);

    // write to services.json file
    await fs.writeJson(path.resolve(__dirname, '../../../../services.json'), nextServices);
  } catch (err) {
    console.log('Error in unregistering service', err);

    throw new InternalError('Error in unregistering service. Please try again.');
  }

  return event;
}

export function returnResponse() {
  return {
    statusCode: 204,
  };
}


export default event => Promise.resolve(event)
  .then(unregisterService)
  .then(returnResponse);
