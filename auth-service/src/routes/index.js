import { httpHandler } from '@hai.dinh/service-libraries';
import login from '../func/login';
import register from '../func/register';

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
];

export default routes;
