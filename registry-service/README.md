# Registry Service

Registry service takes in charge of managing the state of services in the system, including the following tasks:
- Listing services
- Registering/Updating a new service
- Unregistering the specified service

## API

| API | Description |
|-|-|
|`GET /services`| List registered service |
|`GET /services/{serviceId}`| Get information of the specified service |
|`POST /services`| Register/Update a new service |
|`DELETE /services/{serviceId}`| Unregister the specified service |

## HOW-IT-WORKS

The service catalog will be stored in `services.json` file. This file is allocated at root directory

### GET /services

1. Read `services.json` to get service catalog. If any error in reading file, end the flow and throw the error.
2. Return response

### GET /services/{serviceId}

1. Get `serviceId` from params
2..Read `services.json` to get service catalog. If any error in reading file, end the flow and throw the error.
3. Get appropriate service by filtering `serviceId` in service catalog. If no found, throw `NotFoundError`, end the flow
4. Return response

### POST /services/{serviceId}

1. Get `serviceId` from params
2. Read `services.json` to get service catalog. If any error in reading file, end the flow and throw the error.
3. Insert/update service with `serviceId` in service catalog.
4. Write new service catalog in `services.json`.
5. Return response

### DELETE /services/{serviceId}

1. Get `serviceId` from params
2. Read `services.json` to get service catalog. If any error in reading file, end the flow and throw the error.
3. Delete service with `serviceId` in service catalog. If no found, throw `NotFoundError`, end the flow.
4. Write new service catalog in `services.json`.
5. Return response

## TODO

[] Add job to check health of registered service