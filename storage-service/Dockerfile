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

WORKDIR /usr/app

COPY --from=builder /usr/app .

CMD yarn start:prod