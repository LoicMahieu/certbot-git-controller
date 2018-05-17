
import * as assert from "assert";
import { merge } from "lodash";
import * as path from "path";
import Cron from "./Cron";
import Domain from "./Domain";
import GitRepository from "./GitRepository";
import StaticServer from "./StaticServer";

const CERT_DIR = "live";

export interface IControllerOptions {
  certbotDir: string;
  cronInterval: number;
  domains: string[];
  email: string | null;
  port: number;
  renewTime: number;
  staging: boolean;
  webroot: string;
  gitRepository?: string;
}

const defaultOptions: IControllerOptions = {
  certbotDir: "/etc/letsencrypt",
  cronInterval: 1000 * 30, // 30 seconds
  domains: [],
  email: null,
  port: 80,
  renewTime: 1000 * 30, // 30 seconds
  staging: false,
  webroot: "/var/www",
};

export async function start(options: IControllerOptions) {
  options = merge({}, defaultOptions, options);
  validateOptons(options);

  const domains = options.domains .map((domain) => new Domain(options, domain));
  const gitRepository = new GitRepository(options.gitRepository + "", path.join(options.certbotDir, CERT_DIR));
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
