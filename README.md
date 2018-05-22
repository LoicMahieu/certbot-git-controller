
# certbot-git-controller

Simple tool that use certbot for managing Let's Encrypt certificates. It creates a webserver that listen for http-01 challenge and use a git repository as store.

Example use-case: Your frontend load-balancers are decentralized and spreads on multiple servers, your configuration is managed as a git repository. Simply proxify `/.well-known/acme-challenge/` to the `certbot-git-controller` !

### Usage

```
npm install -g certbot-git-controller
certbot-git-controller --gitRepository git@github.com/account/letsencrypt.git --domains github.com --domains google.com
```

### Usage via docker

```
docker run --rm -it loicmahieu/certbot-git-controller --gitRepository git@github.com/account/letsencrypt.git --domains github.com --domains google.com
```
