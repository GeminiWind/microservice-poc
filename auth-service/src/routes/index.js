import { httpHandler } from '@hai.dinh/service-libraries';
import routesVersioning from 'express-routes-versioning';
import { authenticate } from '../lib/middlewares';
import * as api from '../func';

const routesVersioningHandler = routesVersioning();

const routes = [
  {
    path: '/oauth/token',
    method: 'POST',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.login)
    })
  },
  {
    path: '/users',
    method: 'POST',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.register)
    })
  },
  {
    path: '/auth',
    method: 'GET',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.auth)
    })
  }
];

export default routes;
