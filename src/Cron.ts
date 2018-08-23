
import delay = require("delay");
import { IControllerOptions } from "./controller";
import Domain from "./Domain";
import GitRepository from "./GitRepository";
import logger from "./logger";

export default
class Cron {
  private readonly options: IControllerOptions;
  private readonly domains: Domain[];
  private readonly gitRepository: GitRepository;

  constructor(options: IControllerOptions, domains: Domain[], gitRepository: GitRepository) {
    this.options = options;
    this.domains = domains;
    this.gitRepository = gitRepository;
  }

  public async start() {
    await this.initialCheck();
    this.startCron();
  }

  private async initialCheck() {
    await delay(this.options.initialCheckDelay);

    for (const domain of this.domains) {
      await this.renewDomain(domain);
    }
    if (!await this.gitRepository.isClean()) {
      logger.debug("Git repository is not clean.");
      await this.gitRepository.commitAndPush();
      logger.success("Commit and push done!");
    }
  }

  private startCron() {
    setInterval(() => {
      this.doCron();
    }, this.options.cronInterval);
  }

  private async doCron() {
    logger.debug("Start cron job");
    for (const domain of this.domains) {
      await this.renewDomain(domain);
    }

    logger.debug("Check if any change in git repository");
    if (!await this.gitRepository.isClean()) {
      logger.debug("Git repository is not clean, commit and push...");
      await this.gitRepository.commitAndPush();
      logger.success("Commit and push done...");
    } else {
      logger.debug("No change in git repository");
    }
  }

  private async renewDomain(domain: Domain) {
    logger.debug(`Start renew for domain ${domain.name}`);
    if (domain.isRenewNeeded()) {
      logger.debug("Renew is needed.");
      await domain.requestCertificates();
      logger.debug("Renew is done!");
      logger.success("Next renew is planned for", domain.getRenewDate());
    } else {
      logger.debug("No renew is needed at this time..");
      logger.success("Renew is planned for", domain.getRenewDate());
    }
  }
}
