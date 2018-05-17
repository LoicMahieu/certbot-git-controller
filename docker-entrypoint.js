#!/usr/bin/env node

require('/app/lib/controller').start({
  cronInterval: process.env.CRON_INTERNAL,
  domains: (process.env.DOMAINS || '').split(','),
  email: process.env.EMAIL,
  port: process.env.PORT,
  renewTime: process.env.RENEW_TIME,
  staging: false,
  staging: process.env.PRODUCTION !== 1,
  webroot: process.env.WEBROOT,
  gitRepository: process.env.GIT_REPOSITORY
})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
