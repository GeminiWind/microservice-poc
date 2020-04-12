import { httpHandler } from '@hai.dinh/service-libraries';
import routesVersioning from 'express-routes-versioning';
import * as api from '../func';

const routesVersioningHandler = routesVersioning();

const routes = [
  {
    path: '/orders',
    method: 'POST',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.create)
    })
  },
  {
    path: '/orders/:id',
    method: 'GET',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.read)
    })
  },
  {
    path: '/orders',
    method: 'GET',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.list)
    })
  },
  // {
  //   path: '/orders/:id',
  //   method: 'PUT',
  //   handler: httpHandler(func.update),
  // },
  {
    path: '/orders/:id',
    method: 'DELETE',
    handler: routesVersioningHandler({
      '1.0.0': httpHandler(api.v1.remove)
    })
  }
];

export default routes;
