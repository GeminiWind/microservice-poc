FROM node:8.16.0-alpine

EXPOSE 3003

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g yarn

COPY . .

RUN yarn

CMD [ "yarn", "start" ]
