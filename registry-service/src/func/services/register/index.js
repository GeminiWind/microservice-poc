import path from 'path';
import fs from 'fs-extra';
import { InternalError } from 'json-api-error';
import * as R from 'ramda';

export async function validateRequest(event) {
  // TODO: validate the request
  return event;
}

export async function registerService(event) {
  const serviceId = R.path(['body', 'data', 'id'], event);
  const serviceAttributes = R.path(['body', 'data', 'attributes'], event);

  try {
    const servicesFilePath = path.resolve(__dirname, '../../../../services.json');

    const isServiceCatalogExisting = await fs.pathExists(servicesFilePath);

    let currentServices = {};
    if (isServiceCatalogExisting) {
      currentServices = await fs.readJSON(servicesFilePath);
    }

    const nextServices = R.merge(currentServices, { [serviceId]: serviceAttributes });

    // write to services.json file
    await fs.writeJson(servicesFilePath, nextServices);
  } catch (err) {
    console.log('Error in registering service', err);

    throw new InternalError('Error in registering service. Please try again.');
  }

  return event;
}

export function returnResponse(event) {
  const serviceId = R.path(['body', 'data', 'id'], event);
  const serviceAttributes = R.path(['body', 'data', 'attributes'], event);

  return {
    statusCode: 201,
    body: {
      data: {
        id: serviceId,
        type: 'services',
        attributes: serviceAttributes,
      },
    },
  };
}


export default event => Promise.resolve(event)
  .then(validateRequest)
  .then(registerService)
  .then(returnResponse);
