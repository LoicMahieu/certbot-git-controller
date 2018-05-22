#!/usr/bin/env node

import * as yargs from "yargs";
import { defaultOptions, IControllerOptions, start as startController } from "./controller";

function start(argv: any) {
  const opts = argv.argv;
  startController(opts as IControllerOptions)
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

const args = yargs
  .command("serve", "Start the server.")
  .option("certbotDir", {
    default: defaultOptions.certbotDir,
  })
  .option("cronInterval", {
    default: defaultOptions.cronInterval,
  })
  .option("domains", {
    default: defaultOptions.domains,
  })
  .option("email", {
    default: defaultOptions.email,
  })
  .option("initialCheckDelay", {
    default: defaultOptions.initialCheckDelay,
  })
  .option("port", {
    default: defaultOptions.port,
  })
  .option("renewTime", {
    default: defaultOptions.renewTime,
  })
  .option("staging", {
    default: defaultOptions.staging,
  })
  .option("webroot", {
    default: defaultOptions.webroot,
  })
  .options("gitRepository", {
    required: true,
  });

start(args);
