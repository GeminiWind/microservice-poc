FROM node as builder

WORKDIR /usr/app

COPY [ \
    "package.json", \
    "ecosystem.config.yml", \
    "yarn.lock", \
    ".babelrc", \
    "service-definition.json", \
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

EXPOSE 3002

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

RUN apk add --no-cache curl\
    openssl \
    tzdata \
    openssh-client && \
    npm install -g pm2

WORKDIR /usr/app

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN ssh-keygen -t rsa -b 4096 -m PEM -f auth_service_rsa && \
    openssl rsa -in auth_service_rsa -pubout -outform PEM -out auth_service_rsa.pub

COPY --from=builder /usr/app .

RUN npm rebuild

# FIXME: This is wrong way.
# Please only register service after service is up (pm2)
CMD /wait && \
    yarn service-registry-cli pull -h etcd:2379 && \
    yarn service-registry-cli register --service.endpoint http://auth-service:3002 -h etcd:2379 && \
    pm2-runtime ecosystem.config.yml