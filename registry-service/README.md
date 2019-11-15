# Registry Service

Registry service takes in charge of managing the state of services in the system. It also support registering/unregistering a new service into system

## API

| API | Description |
|-|-|
|`GET /services`| List registered service |
|`GET /services/{serviceId}`| Get information of the specified service |
|`POST /services`| Register/Update a new service |
|`DELETE /services/{serviceId}`| Unregister the specified service |

## HOW-IT-WORKS

TBD

## TODO

[] Add job to check health of registered service