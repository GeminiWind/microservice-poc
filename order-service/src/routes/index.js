import { httpHandler } from '@hai.dinh/service-libraries';
import * as func from '../func';

const routes = [
  {
    path: '/orders',
    method: 'POST',
    handler: httpHandler(func.create),
  },
  {
    path: '/orders/:id',
    method: 'GET',
    handler: httpHandler(func.read),
  },
  {
    path: '/orders',
    method: 'GET',
    handler: httpHandler(func.list),
  },
  // {
  //   path: '/orders/:id',
  //   method: 'PUT',
  //   handler: httpHandler(func.update),
  // },
  {
    path: '/orders/:id',
    method: 'DELETE',
    handler: httpHandler(func.remove),
  },
];

export default routes;
