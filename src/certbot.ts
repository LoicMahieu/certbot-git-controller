import { IControllerOptions } from "./controller";
import Domain from "./Domain";
import GitRepository from "./GitRepository";

export async function initialCertbot(domains: Domain[], gitRepository: GitRepository) {
  for (const domain of domains) {
    await domain.requestCerts();
  }

  if (!await gitRepository.isClean()) {
    console.log("Git repository is not clean.");
    await gitRepository.commitAndPush();
    console.log("Commit and push done!");
  }
}

export function startCron(options: IControllerOptions, domains: Domain[], gitRepository: GitRepository) {
  setInterval(() => {
    doCron(domains, gitRepository);
  }, options.cronInterval);
}

async function doCron(domains: Domain[], gitRepository: GitRepository) {
  console.log("Start cron job");
  for (const domain of domains) {
    await doCronForDomain(domain);
  }

  console.log("Check if any change in git repository");
  if (!await gitRepository.isClean()) {
    await gitRepository.commitAndPush();
  }
}

async function doCronForDomain(domain: Domain) {
  console.log(`Start cron for domain ${domain.name}`);
  if (domain.isRenewNeeded()) {
    console.log("Renew is needed.");
    await domain.requestCerts();
    console.log("Renew is done!");
  } else {
    console.log("No renew is needed at this time..");
  }
}
