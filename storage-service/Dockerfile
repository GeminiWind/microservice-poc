FROM node:alpine as builder

WORKDIR /usr/app

COPY [ \
    "package.json", \
    "yarn.lock", \
    ".babelrc", \
    "./" \
    ]

RUN yarn

COPY scripts scripts
COPY src src

RUN yarn build && \
    rm -rf src && \
    rm -rf scripts && \
    rm yarn.lock && \
    rm .babelrc


FROM node:alpine

EXPOSE 3001

RUN apk add --no-cache curl
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

WORKDIR /usr/app

COPY --from=builder /usr/app .

CMD /wait && \
    curl --location --request POST 'http://registry-service:3000/services' \
    --header 'Content-Type: application/json' \
    --data-raw '{"data": {"id": "storage-service","type": "services","attributes": {"name": "storage-service","endpoint": "http://storage-service:3001"}}}' && \
    yarn start:prod