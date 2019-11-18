# Storage Service

Shared storage service in micro service system

| API | Description |
|-|-|   
| POST /collections| Create new collection schema in specified database |
| DELETE /collections/{collectionName}| Delete specified collection schema in specified database |
| GET /collections/{collectionName}/documents | Get all or specified documents based on query  |
| POST /collections/{collectionName}/documents | Create new document  |
| GET /collections/{collectionName}/documents/{documentId} | Get specified document by their id  |
| PATCH /collections/{collectionName}/documents/{documentId} | Update specified document by their id  |
| DELETE /collections/{collectionName}/documents/{documentId} | Delete  specified document by their id  |