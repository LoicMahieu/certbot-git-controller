
import * as execa from "execa";
import { IControllerOptions } from "./controller";
import logger from "./logger";

const CERTBOT_BIN = "certbot";
const CERTBOT_BASE_ARGS = [
  "--non-interactive",
  "--agree-tos",
];

export default
class Domain {
  public readonly name: string;
  private readonly options: IControllerOptions;
  private lastCertUpdate: Date | null;
  private failCount: number;

  constructor(options: IControllerOptions, name: string) {
    this.name = name;
    this.options = options;
    this.lastCertUpdate = null;
    this.failCount = 0;
  }

  public async requestCertificates() {
    try {
      if (this.failCount >= this.options.renewMaxFail) {
        throw new Error("Too many fail for request certificates. Please check the problem.");
      }

      await certbot(["certonly", ...this.getCertbotBaseArgs()]);
      this.lastCertUpdate = new Date();
      this.failCount = 0;
    } catch (err) {
      this.failCount++;
      logger.error(`Error during request certificates for domain ${this.name}`, err);
    }
  }

  public isRenewNeeded() {
    if (!this.lastCertUpdate) {
      return true;
    }
    const now = new Date();
    const renewDate = this.getRenewDate();
    return now.getTime() >= renewDate.getTime();
  }

  public getRenewDate() {
    if (!this.lastCertUpdate) {
      return new Date();
    }
    return new Date(this.lastCertUpdate.getTime() + this.options.renewTime);
  }

  private getCertbotBaseArgs() {
    return [
      ...CERTBOT_BASE_ARGS,
      this.options.staging ? "--test-cert" : "",
      "-m", this.options.email + "",
      "-d", this.name,
      "--webroot",
      "-w", this.options.webroot,
    ].filter(Boolean);
  }
}

async function certbot(args: string[]) {
  await execa(CERTBOT_BIN, args, { stdio: "inherit" });
}
