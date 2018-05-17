#!/usr/bin/env node

require('../lib/controller').start({
  domains: (process.env.DOMAINS || '').split(','),
  email: process.env.EMAIL,
  port: process.env.PORT,
  staging: process.env.PRODUCTION !== 1,
  webroot: process.env.WEBROOT,
  gitRepository: process.env.GIT_REPOSITORY
})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
