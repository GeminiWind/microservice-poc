FROM node:alpine as builder

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn
RUN yarn build

FROM node:alpine

COPY --from=builder build build
CMD yarn start:prod