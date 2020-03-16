FROM node:alpine as builder

WORKDIR /usr/app

COPY [ \
    "package.json", \
    "yarn.lock", \
    ".babelrc", \
    "ecosystem.config.yml", \
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

EXPOSE 3000

RUN apk add --no-cache tzdata

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/app

RUN npm install -g pm2

COPY --from=builder /usr/app .

CMD pm2-runtime ecosystem.config.yml