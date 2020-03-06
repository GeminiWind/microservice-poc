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

EXPOSE 3000

WORKDIR /usr/app

RUN npm install -g pm2

COPY --from=builder /usr/app .

CMD pm2-runtime ecosystem.config.yml