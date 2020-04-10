import { httpHandler } from '@hai.dinh/service-libraries';
import cors from 'cors';
import routesVersioning from 'express-routes-versioning';
import * as api from '../func';
import swaggerSpec from '../func/v1/swagger';

const routesVersioningHandler = routesVersioning();

const routes = [
  {
    method: 'GET',
    path: '/documents/:path(*)',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.read),
    }),
  },
  {
    method: 'GET',
    path: '/documents',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.list),
    }),
  },
  {
    method: 'POST',
    path: '/documents',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.create),
    }),
  },
  {
    method: 'PATCH',
    path: '/documents/:path(*)',
    handler: routesVersioningHandler({
      '^1.0.0': httpHandler(api.v1.update),
    }),
  },
  {
    method: 'DELETE',
    path: '/documents/:path(*)',
    handler: routesVersioningHandler({
      '1.0.0': httpHandler(api.v1.remove),
    }),
  },
  {
    method: 'GET',
    path: '/swagger.json',
    middlewares: [cors()],
    handler: routesVersioningHandler({
      '1.0.0': httpHandler(() => ({
        statusCode: 200,
        body: swaggerSpec,
        headers: {
          'Content-Type': 'application/json',
        },
      }))
    }),
  },
];

export default routes;
