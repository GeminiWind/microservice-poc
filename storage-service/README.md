# Storage Service

Shared storage service in micro service system

| API | Description |
|-|-|   
| POST /collections| Create new collection schema in specified database |
| DELETE /collections/{collection}| Delete specified collection schema in specified database |
| GET /collections/{collection}/documents | Get all or specified documents based on query  |
| POST /collections/{collection}/documents | Create new document  |
| GET /collections/{collection}/documents/{documentId} | Get specified document by their id  |
| PATCH /collections/{collection}/documents/{documentId} | Update specified document by their id  |
| DELETE /collections/{collection}/documents/{documentId} | Delete  specified document by their id  |

## TODOS

[] Support bulk operator (insert, update)
[] Write tests