#!/usr/bin/env node

require('/app/lib/controller').start({
  cronInterval: process.env.CRON_INTERNAL,
  domains: (process.env.DOMAINS || '').trim().split(','),
  email: process.env.EMAIL,
  initialCheckDelay: process.env.INITIAL_CHECK_DELAY,
  port: process.env.PORT,
  renewTime: process.env.RENEW_TIME,
  staging: process.env.STAGING && (process.env.STAGING || '').trim() !== "false",
  webroot: process.env.WEBROOT,
  gitRepository: process.env.GIT_REPOSITORY
})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
