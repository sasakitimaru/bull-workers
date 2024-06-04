#### base ####
FROM node:18.3.0-slim as node
FROM ubuntu:focal-20220531 as base
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get -qq install -y --no-install-recommends \
    tini \
    && rm -rf /var/lib/apt/lists/*

COPY --from=node /usr/local/include/ /usr/local/include/
COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /usr/local/bin/ /usr/local/bin/
RUN corepack disable && corepack enable

RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node \
    && mkdir /app \
    && chown -R node:node /app

WORKDIR /app
USER node
COPY --chown=node:node package*.json ./
RUN npm install --only=production && npm cache clean --force

#### dev-server ####
FROM base as dev-server
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
COPY --chown=node:node . .
RUN npm install && npm cache clean --force
RUN npm run build
CMD ["node", "dist/main.js"]

#### dev-consumer ####
FROM base as dev-consumer
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
COPY --chown=node:node . .
RUN npm install && npm cache clean --force
RUN npm run build
CMD ["node", "dist/consumer.js"]

#### prod-server ####
FROM base as prod-server
COPY --chown=node:node . .
RUN npm run build
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/main.js"]

#### prod-consumer ####
FROM base as prod-consumer
COPY --chown=node:node . .
RUN npm run build
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/consumer.js"]
