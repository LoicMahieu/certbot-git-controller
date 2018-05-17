FROM node:10-alpine

RUN apk add --no-cache \
  openssh \
  git \
  certbot

ADD yarn.lock package.json /app/
RUN cd /app && yarn install --pure-lockfile --ignore-scripts
ADD . /app/
RUN cd /app && yarn build && chmod +x /app/docker-entrypoint.js

ENTRYPOINT [ "/app/docker-entrypoint.js" ]
