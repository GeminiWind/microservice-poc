import path from 'path';
import fs from 'fs-extra';
import { InternalError, NotFoundError } from 'json-api-error';
import * as R from 'ramda';

export async function readService(event) {
  const serviceId = R.path(['params', 'serviceId'], event);

  let service;
  try {
    const services = await fs.readJSON(path.resolve(__dirname, '../../../../services.json'));

    service = R.path([serviceId], services);
  } catch (err) {
    console.log('Error in getting service', err);

    throw new InternalError('Error in getting service. Please try again.');
  }

  if (!service) {
    throw new NotFoundError('Your service was not found.');
  }

  return {
    ...event,
    service,
  };
}

export function returnResponse(event) {
  const serviceId = R.path(['params', 'serviceId'], event);

  return {
    statusCode: 200,
    body: {
      data: {
        id: serviceId,
        type: 'services',
        attributes: R.path(['service'], event),
      },
    },
  };
}

export default R.pipeP(
  req => Promise.resolve(req),
  readService,
  returnResponse,
);
