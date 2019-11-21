import HttpHandler from '../lib/HttpHandler';
import * as documents from '../func/documents';

const routes = [
  {
    method: 'GET',
    path: '/documents/:id',
    handler: HttpHandler(documents.read),
  },
  {
    method: 'GET',
    path: '/documents',
    handler: HttpHandler(documents.list),
  },
  {
    method: 'POST',
    path: '/documents',
    handler: HttpHandler(documents.create),
  },
  {
    method: 'PATCH',
    path: '/documents/:id',
    handler: HttpHandler(documents.update),
  },
  {
    method: 'DELETE',
    path: '/documents/:id',
    handler: HttpHandler(documents.remove),
  },
];

export default routes;
