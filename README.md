# Mircoservice POC

![CI/CD](https://github.com/GeminiWind/microservice-poc/workflows/CI/badge.svg?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is prove of concept for microservice, which is mostly written in NodeJS.

It provides basic overview about: 
- How to design microservice architecture
- What do you need to concern in implementing mircoservice architecture and the way to combat them, such as user authentication, service discovery, monitoring, logging, tracing
- How does service communicate within microservice system
- The list go on

**_Note: Do not use this POC in production mode_**

## Architecture

![Architecture](./architecture.png)

### Services

- **Storage Service**: supports manipulating record in database by exposing API for other services in the system can consume. The systems uses *"unique database across service"* strategy.
- **Authentication Service**: provides security layer (authentication) for entire microservice system
- **Order Service**: process orders.
- **Monitoring**: monitor resource system (CPU, memory, network in/out ...) for micro-service, built with Grafana & Promotheus
- **Logging**: centralized logging for microservice system, built with [ELK stack](https://www.elastic.co/what-is/elk-stack).

### Common libraries

- [**service-registry-cli**](https://www.npmjs.com/package/@hai.dinh/service-registry-cli): registers and resolves dependencies in service to allow it can communicate with other service in microservice system
- [**service-libraries**](https://www.npmjs.com/package/@hai.dinh/service-libraries): resolves service mesh: tracing, service discovery, logging and more.

## Prerequisites

- [Docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [NodeJs v10](https://nodejs.org/dist/latest-v10.x/)
- Available port: 80,443, 5601, 3000

## Getting Started

- Run without https
```bash
docker-compose up
```
- Run with https
  - Add new dns record to your `/etc/hosts`:
    ```
    127.0.0.1   api.microservice.com
    ```
  - Generate self-signed certificate (using `mkcert`). Your cert will be located at `api-gateway/cert`
    ```
    chmod +x ./tools/mkcert
    chmod +x ./scripts/generate-self-cert.sh
    ./scripts/generate-self-cert.sh
    ```
  - Run docker compose
    ```
    docker-compose up
    ```
After docker-compose is up, you can access the following components:

- Monitoring(Grafana): http://localhost:3000 (Credential: admin/admin)
- Centralized logging (Kibana): http://localhost:5601 (Credential: elastic/admin)
- Open API (Postman collection and environment is in `./tests`. Please update `endpoint` environment variable based on your scheme http or https. By default, it is `http://localhost`):
  - Without https: http://localhost
  - With https: https://api.microservice.com
## Testing

To test, run the following command

1. Install dependencies
```bash
# with npm
npm install
# or with yarn
yarn
```
2. Run test
By default, the test use `http://localhost` as endpoint to execute tests.
To change the endpoint, please update value of`endpoint` environment variable in Postman Environment file (`./tests/postman_environment.json`)

```bash
./scripts/test
```

## Teardown

```bash
docker-compose down
```