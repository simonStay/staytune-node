# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim

WORKDIR /tmp/app


COPY package.json .
RUN yarn
COPY . .
RUN yarn build && \
  mkdir -p /opt/app && \
  mv dist index.js package.json yarn.lock node_modules /opt/app

WORKDIR /opt/app

RUN yarn --production


