#!/usr/bin/env node

import * as fs from "fs";
import * as yargs from "yargs";
import { defaultOptions, IControllerOptions, start as startController } from "./controller";

function start(argv: any) {
  const { domainsFile, staging, ...opts } = argv.argv;

  opts.staging = staging !== "false";

  if (domainsFile) {
    const domainsFileContent = fs.readFileSync(domainsFile).toString("utf8");
    const domains = domainsFileContent.split(/,|\n/).map((d) => d && d.trim()).filter(Boolean);
    opts.domains = domains;
  }

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
  .option("cleanCertbotDir", {
    boolean: true,
    default: defaultOptions.cleanCertbotDir,
  })
  .option("cronInterval", {
    default: defaultOptions.cronInterval,
  })
  .option("domains", {
    array: true,
    default: defaultOptions.domains,
  })
  .option("domainsFile", {})
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
