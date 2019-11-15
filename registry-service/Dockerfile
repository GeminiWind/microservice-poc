FROM node:alpine as builder

WORKDIR /usr/app

COPY [ \
    "package.json", \
    "yarn.lock", \
    ".babelrc", \
    "services.json", \
    "./" \
    ]

RUN yarn

COPY scripts scripts
COPY src src

RUN yarn build


FROM node:alpine

EXPOSE 3000

WORKDIR /usr/app

COPY --from=builder /usr/app/build build
COPY --from=builder /usr/app/package.json package.json

CMD yarn start:prod