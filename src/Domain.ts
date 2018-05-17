
import * as execa from "execa";
import { IControllerOptions } from "./controller";

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

  constructor(options: IControllerOptions, name: string) {
    this.name = name;
    this.options = options;
    this.lastCertUpdate = null;
  }

  public async requestCerts() {
    try {
      await certbot(["certonly", ...this.getCertbotBaseArgs()]);
      this.lastCertUpdate = new Date();
    } catch (err) {
      console.error(`Error during request certificates for domain ${this.name}`, err);
    }
  }

  public isRenewNeeded() {
    if (!this.lastCertUpdate) {
      return true;
    }
    const now = new Date();
    return now.getTime() - this.lastCertUpdate.getTime() >= this.options.renewTime;
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
