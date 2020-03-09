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

EXPOSE 3002

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

RUN apk add --no-cache curl\
    openssl \
    openssh-client && \
    npm install -g pm2

WORKDIR /usr/app

RUN ssh-keygen -t rsa -b 4096 -m PEM -f auth_service_rsa && \
    openssl rsa -in auth_service_rsa -pubout -outform PEM -out auth_service_rsa.pub

COPY --from=builder /usr/app .

CMD /wait && \
    curl --location --request POST 'http://registry-service:3000/services' \
    --header 'Content-Type: application/vnd.api+json' \
    --data-raw '{"data": {"id": "auth-service","type": "services","attributes": {"name": "auth-service","endpoint": "http://auth-service:3002"}}}' && \
    pm2-runtime ecosystem.config.yml