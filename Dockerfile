FROM node:22-alpine

WORKDIR /app

COPY src /app/src

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

RUN yarn install

HEALTHCHECK  --interval=30s --timeout=3s \
  CMD wget -nv -t1 --spider --spider http://localhost:5107/v1/riot/api/status || exit 1

CMD ["yarn", "dev"]
