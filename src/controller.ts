
import * as assert from "assert";
import { merge } from "lodash";
import ms = require("ms");
import Cron from "./Cron";
import Domain from "./Domain";
import GitRepository from "./GitRepository";
import logger from "./logger";
import { setup } from "./sentry";
import StaticServer from "./StaticServer";

export interface IControllerOptions {
  certbotDir: string;
  cleanCertbotDir: boolean;
  cronInterval: number;
  domains: string[];
  email: string | null;
  initialCheckDelay: number;
  port: number;
  renewMaxFail: number;
  renewTime: number;
  sentryDSN: string | undefined;
  staging: boolean;
  webroot: string;
  gitRepository?: string;
}

export const defaultOptions: IControllerOptions = {
  certbotDir: "/etc/letsencrypt",
  cleanCertbotDir: true,
  cronInterval: ms("30s"),
  domains: [],
  email: null,
  initialCheckDelay: ms("10s"),
  port: 80,
  renewMaxFail: 3,
  renewTime: ms("6h"),
  sentryDSN: process.env.SENTRY_DSN,
  staging: false,
  webroot: "/var/www",
};

export async function start(options: IControllerOptions) {
  setup(options.sentryDSN);

  options = merge({}, defaultOptions, options);
  validateOptons(options);

  logger.success("Start with options:", options);

  const domains = options.domains.map((domain) => new Domain(options, domain));
  const gitRepository = new GitRepository(options.gitRepository + "", options.certbotDir);
  const server = new StaticServer(options);
  const cron = new Cron(options, domains, gitRepository);

  await server.listen();
  logger.success(`Web server started: http://localhost:${server.port}`);

  await gitRepository.ensureKnownHost();
  await gitRepository.createRepositoryIfNeeded(options.cleanCertbotDir);
  await cron.start();
}

function validateOptons(options: IControllerOptions) {
  assert(options.gitRepository, "Options `gitRepository` is mandatory!");
}
