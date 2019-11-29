import { httpHandler } from '@hai.dinh/service-libraries';
import * as documents from '../func/documents';

const routes = [
  {
    method: 'GET',
    path: '/documents/:path(*)',
    handler: httpHandler(documents.read),
  },
  {
    method: 'GET',
    path: '/documents',
    handler: httpHandler(documents.list),
  },
  {
    method: 'POST',
    path: '/documents',
    handler: httpHandler(documents.create),
  },
  {
    method: 'PATCH',
    path: '/documents/:path(*)',
    handler: httpHandler(documents.update),
  },
  {
    method: 'DELETE',
    path: '/documents/:path(*)',
    handler: httpHandler(documents.remove),
  },
];

export default routes;
