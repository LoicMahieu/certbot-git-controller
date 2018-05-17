FROM node:10-alpine

RUN apk add --no-cache \
  openssh \
  git \
  certbot

ADD docker-entrypoint.js /docker-entrypoint.js
RUN chmod +x /docker-entrypoint.js

ADD node_modules /node_modules
ADD lib /lib

ENTRYPOINT /docker-entrypoint.js
