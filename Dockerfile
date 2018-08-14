FROM node:10-alpine as app
ADD . /app/
RUN cd /app && yarn install --pure-lockfile
RUN cd /app && yarn install --production
RUN rm -rf /app/src

FROM mhart/alpine-node:base-10.8.0 as node

FROM certbot/certbot:v0.26.1
RUN apk add --no-cache openssh git
COPY --from=app /app/ /app/
COPY --from=node /usr/bin/node /usr/bin/node
ENV PATH="/app/bin:${PATH}"

ENTRYPOINT "certbot-git-controller"
