# Mircoservice POC

This is prove of concept for microservice, which is mostly written in NodeJS.

It provides basic overview about: 
- How to design microservice architecture
- What do you need to concern in implementing mircoservice architecture and the way to combat them, such as authentication, service discovery, monitoring
- How does microservice work
- The list go on

Please note that this is POC, not ready to be run in production mode

## Architecture

![Architecture](./architecture.png)

### Services

- **Registry Service**: manage service state, execute registering/unregistering service.
- **Storage Service**: support manipulating record in database by exposing API for other services in the system can consume. The systems use 1 database for storing.
- **Authentication Service**: manage user (create/update/delete) and do authentication
- **Order Service**: process orders.
- **Monitoring**: monitor CPU, memory, network and more for each service

## Prerequisites

- [Docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)

## Getting Started

```bash
docker-compose up
```

After docker-compose is up, you can access the following components:

- Monitoring(Grafana): http://localhost:3000 (Credential: admin/admin)
- Open API: http://localhost (Postman collection and environment is located at `./tests`)

## Testing

To test, run the following command
```bash
npm install
./scripts/test
```

## Teardown

```bash
docker-compose down
```