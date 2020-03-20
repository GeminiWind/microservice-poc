FROM node as builder

WORKDIR /usr/app

COPY [ \
    "package.json", \
    "ecosystem.config.yml", \
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

ARG TIMEZONE

ENV TZ ${TIMEZONE}

EXPOSE 3003

RUN apk add --no-cache curl \
    tzdata && \
    npm install -g pm2

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

WORKDIR /usr/app

COPY --from=builder /usr/app .

CMD /wait && \
    curl --location --request POST 'http://registry-service:3000/services' \
    --header 'Content-Type: application/vnd.api+json' \
    --data-raw '{"data": {"id": "order-service","type": "services","attributes": {"name": "order-service","endpoint": "http://order-service:3003"}}}' && \
    pm2-runtime ecosystem.config.yml --env production