import HttpHandler from '../lib/HttpHandler';
import * as collections from '../func/collections';
import * as documents from '../func/documents';

const routes = [
  {
    method: 'POST',
    path: '/collections/',
    handler: HttpHandler(collections.create),
  },
  {
    method: 'PUT',
    path: '/collections/:collection',
    handler: HttpHandler(collections.update),
  },
  {
    method: 'DELETE',
    path: '/collections/:collection',
    handler: HttpHandler(collections.remove),
  },
  {
    method: 'GET',
    path: '/collections/:collection/documents/:id',
    handler: HttpHandler(documents.read),
  },
  // {
  //   method: 'GET',
  //   path: '/collections/:collectionName/documents',
  //   handler: HttpHandler(documents.list),
  // },
  {
    method: 'POST',
    path: '/collections/:collection/documents',
    handler: HttpHandler(documents.create),
  },
  // {
  //   method: 'PATCH',
  //   path: '/collections/:collectionName/documents/:id',
  //   handler: HttpHandler(documents.update),
  // },
  {
    method: 'DELETE',
    path: '/collections/:collection/documents/:id',
    handler: HttpHandler(documents.remove),
  },
];

export default routes;
