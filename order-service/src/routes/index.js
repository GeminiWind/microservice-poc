import { httpHandler } from '@hai.dinh/service-libraries';
import * as func from '../func';

const routes = [
  {
    path: '/',
    method: 'POST',
    handler: httpHandler(func.create),
  },
  {
    path: '/:id',
    method: 'GET',
    handler: httpHandler(func.read),
  },
  {
    path: '/',
    method: 'GET',
    handler: httpHandler(func.list),
  },
  // {
  //   path: '/orders/:id',
  //   method: 'PUT',
  //   handler: httpHandler(func.update),
  // },
  {
    path: '/:id',
    method: 'DELETE',
    handler: httpHandler(func.remove),
  },
];

export default routes;
