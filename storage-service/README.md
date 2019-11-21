# Storage Service

Shared storage service in micro service system

It's only one table. Aggregate is used as technique to modeling data. More info about data modeling in NoSQL at [here](https://highlyscalable.wordpress.com/2012/03/01/nosql-data-modeling-techniques/)

Sample document in table

```
    _id: '8375c060-0008-4b66-853c-09bf069d1338',
    Path: 'user/haidv@gmail.com',
    Type: 'user',
    Attributes: {
        CreatedAt: '2020-10-10',
        UpdatedAt: '2020-10-10'
    },
    Content: {
        email: 'haidv@gmail.com'
    }
```

in which
- `Path`: unique index to leverage rich query (handle relationship, ...)
- _id: default index of MongoDB

## API

| API | Description |
|-|-|
| GET /documents | List documents  |   
| POST /documents | Create new document  |
| GET /documents/{id} | Get specified document by their id  |
| PATCH /documents/{id} | Update specified document by their id  |
| DELETE /documents/{id} | Delete  specified document by their id  |

## TODOS

- [] Index manipulation
- [] Support bulk operator (insert, update)
- [] Write tests