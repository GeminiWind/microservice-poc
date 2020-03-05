import { httpHandler } from '@hai.dinh/service-libraries';
import * as services from '../func/services';

const routes = [
  {
    method: 'GET',
    path: '/services',
    handler: httpHandler(services.list),
  },
  {
    method: 'GET',
    path: '/services/:serviceId',
    handler: httpHandler(services.read),
  },
  {
    method: 'POST',
    path: '/services',
    handler: httpHandler(services.register),
  },
  {
    method: 'DELETE',
    path: '/services/:serviceId',
    handler: httpHandler(services.unregister),
  },
];

export default routes;
