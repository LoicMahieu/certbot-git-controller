#!/usr/bin/env node


const fs = require("fs");
const path = require("path");
const domains = fs.readFileSync(path.join(__dirname, "domains.txt"), "utf8")
  .split("\n")
  .map(v => v.trim())
  .filter(Boolean);

require("/app/lib/controller").start({
  cronInterval: process.env.CRON_INTERNAL,
  domains,
  email: process.env.EMAIL,
  initialCheckDelay: process.env.INITIAL_CHECK_DELAY,
  port: process.env.PORT,
  renewTime: process.env.RENEW_TIME,
  staging: process.env.STAGING && (process.env.STAGING || "").trim() !== "false",
  webroot: process.env.WEBROOT,
  gitRepository: process.env.GIT_REPOSITORY
})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
