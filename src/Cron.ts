
import { IControllerOptions } from "./controller";
import Domain from "./Domain";
import GitRepository from "./GitRepository";

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
    for (const domain of this.domains) {
      await domain.requestCertificates();
    }
    if (!await this.gitRepository.isClean()) {
      console.log("Git repository is not clean.");
      await this.gitRepository.commitAndPush();
      console.log("Commit and push done!");
    }
  }

  private startCron() {
    setInterval(() => {
      this.doCron();
    }, this.options.cronInterval);
  }

  private async doCron() {
    console.log("Start cron job");
    for (const domain of this.domains) {
      await this.doCronForDomain(domain);
    }

    console.log("Check if any change in git repository");
    if (!await this.gitRepository.isClean()) {
      console.log("Git repository is not clean, commit and push...");
      await this.gitRepository.commitAndPush();
      console.log("Commit and push done...");
    }
  }

  private async doCronForDomain(domain: Domain) {
    console.log(`Start cron for domain ${domain.name}`);
    if (domain.isRenewNeeded()) {
      console.log("Renew is needed.");
      await domain.requestCertificates();
      console.log("Renew is done!");
    } else {
      console.log("No renew is needed at this time..");
    }
  }
}
