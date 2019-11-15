import HttpHandler from '../lib/HttpHandler';
import * as services from '../func/services';

const routes = [
  {
    method: 'GET',
    path: '/services',
    handler: HttpHandler(services.list),
  },
  {
    method: 'GET',
    path: '/services/:serviceId',
    handler: HttpHandler(services.read),
  },
  {
    method: 'POST',
    path: '/services',
    handler: HttpHandler(services.register),
  },
  {
    method: 'DELETE',
    path: '/services/:serviceId',
    handler: HttpHandler(services.unregister),
  },
];

export default routes;
