FROM node:22-alpine

WORKDIR /app

COPY src /app/src

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

RUN yarn install

CMD ["yarn", "dev"]