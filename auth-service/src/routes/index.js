import { httpHandler } from '@hai.dinh/service-libraries';
import { authenticate } from '../lib/middlewares'
import login from '../func/login';
import register from '../func/register';
import auth from '../func/auth';

const routes = [
  {
    path: '/tokens',
    method: 'POST',
    handler: httpHandler(login),
  },
  {
    path: '/users',
    method: 'POST',
    handler: httpHandler(register),
  },
  {
    path: '/auth',
    method: 'GET',
    middlewares: [authenticate],
    handler: httpHandler(auth),
  },
];

export default routes;
