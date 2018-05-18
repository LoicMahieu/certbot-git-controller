
import * as assert from "assert";
import { merge } from "lodash";
import ms = require("ms");
import Cron from "./Cron";
import Domain from "./Domain";
import GitRepository from "./GitRepository";
import StaticServer from "./StaticServer";

export interface IControllerOptions {
  certbotDir: string;
  cronInterval: number;
  domains: string[];
  email: string | null;
  initialCheckDelay: number;
  port: number;
  renewTime: number;
  staging: boolean;
  webroot: string;
  gitRepository?: string;
}

const defaultOptions: IControllerOptions = {
  certbotDir: "/etc/letsencrypt",
  cronInterval: ms("30s"),
  domains: [],
  email: null,
  initialCheckDelay: ms("10s"),
  port: 80,
  renewTime: ms("6h"),
  staging: false,
  webroot: "/var/www",
};

export async function start(options: IControllerOptions) {
  options = merge({}, defaultOptions, options);
  validateOptons(options);

  console.log("Start with options:");
  console.log(options);

  const domains = options.domains .map((domain) => new Domain(options, domain));
  const gitRepository = new GitRepository(options.gitRepository + "", options.certbotDir);
  const server = new StaticServer(options);
  const cron = new Cron(options, domains, gitRepository);

  await server.listen();
  console.log(`Web server started: http://localhost:${server.port}`);

  await gitRepository.ensureKnownHost();
  await gitRepository.createRepositoryIfNeeded();
  await cron.start();
}

function validateOptons(options: IControllerOptions) {
  assert(options.gitRepository, "Options `gitRepository` is mandatory!");
}
