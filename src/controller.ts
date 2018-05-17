
import * as assert from "assert";
import { merge } from "lodash";
import * as path from "path";
import { initialCertbot, startCron } from "./certbot";
import Domain from "./Domain";
import GitRepository from "./GitRepository";
import { createServer } from "./server";

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
  cronInterval: 1000 * 10, // 1 minute
  domains: [],
  email: null,
  port: 80,
  renewTime: 1000 * 10, // 1 minute
  staging: false,
  webroot: "/var/www",
};

export async function start(options: IControllerOptions) {
  options = merge({}, defaultOptions, options);
  validateOptons(options);

  const domains = options.domains
    .map((domain) => new Domain(options, domain));
  const gitRepository = new GitRepository(options.gitRepository + "", path.join(options.certbotDir, CERT_DIR));

  createServer(options).listen(options.port);
  console.log(`Web server started: http://localhost${options.port}`);

  await gitRepository.ensureKnownHost();
  await gitRepository.createRepositoryIfNeeded();

  await initialCertbot(domains, gitRepository);
  startCron(options, domains, gitRepository);
}

function validateOptons(options: IControllerOptions) {
  assert(options.gitRepository, "Options `gitRepository` is mandatory!");
}
