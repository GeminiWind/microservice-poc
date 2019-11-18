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
    method: 'DELETE',
    path: '/collections/:collectionName',
    handler: HttpHandler(collections.remove),
  },
  {
    method: 'GET',
    path: '/collections/:collectionName/documents/:id',
    handler: HttpHandler(documents.read),
  },
  // {
  //   method: 'GET',
  //   path: '/collections/:collectionName/documents',
  //   handler: HttpHandler(documents.list),
  // },
  // {
  //   method: 'POST',
  //   path: '/collections/:collectionName/documents',
  //   handler: HttpHandler(documents.create),
  // },
  // {
  //   method: 'PATCH',
  //   path: '/collections/:collectionName/documents/:id',
  //   handler: HttpHandler(documents.update),
  // },
  {
    method: 'DELETE',
    path: '/collections/:collectionName/documents/:id',
    handler: HttpHandler(documents.remove),
  },
];

export default routes;
