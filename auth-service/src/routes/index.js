import { httpHandler } from '@hai.dinh/service-libraries';
import login from '../func/login';
import register from '../func/register';

const routes = [
  {
    path: '/health',
    method: 'GET',
    handler: () => ({
      statusCode: 200,
      body: {},
    }),
  },
  {
    path: '/tokens',
    method: 'POST',
    handler: httpHandler(login),
  },
  {
    path: '/users',
    method: 'POST',
    controller: httpHandler(register),
  }
];

export default routes;
