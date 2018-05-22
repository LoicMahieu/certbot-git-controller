FROM node:10-alpine
ADD . /app/
RUN cd /app && yarn install --pure-lockfile
RUN cd /app && yarn install --production
RUN rm -rf /app/src

FROM node:10-alpine
RUN apk add --no-cache openssh git certbot
COPY --from=0 /app/ /app/
ENV PATH="/app/bin:${PATH}"

ENTRYPOINT "certbot-git-controller"
