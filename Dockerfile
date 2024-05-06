FROM node:22-alpine

WORKDIR /app

COPY src /app/src

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json

RUN yarn install

cmd ["yarn", "dev"]