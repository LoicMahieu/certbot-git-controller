
import * as execa from "execa";
import * as fs from "fs-extra";
import gitUrlParse = require("git-url-parse");
import * as path from "path";
import * as userHome from "user-home";

export default
class GitRepository {
  private readonly remote: string;
  private readonly cwd: string;

  constructor(remote: string, cwd: string) {
    this.remote = remote;
    this.cwd = cwd;
  }

  public async createRepositoryIfNeeded() {
    if (await fs.pathExists(this.cwd)) {
      await fs.remove(this.cwd);
    }
    await fs.ensureDir(this.cwd);

    // Clone repository if not exists
    if (!await fs.pathExists(path.join(this.cwd, ".git"))) {
      await execa("git", [
        "clone",
        this.remote,
        this.cwd,
      ], { stdio: "inherit" });
    }

    // Fetch origin
    await execa("git", ["fetch", "origin"], { cwd: this.cwd, stdio: "inherit" });

    // Reset hard to master
    await execa("git", ["reset", "--hard", "origin/master"], { cwd: this.cwd, stdio: "inherit" });
  }

  public async ensureKnownHost() {
    const { resource } = gitUrlParse(this.remote);
    const sshDir = path.join(userHome, ".ssh");
    const knownHostFile = path.join(sshDir, "known_hosts");

    await fs.ensureDir(sshDir);

    let knownHost = "";
    try {
      knownHost = (await fs.readFile(knownHostFile)).toString();
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }

    if (knownHost.indexOf(resource) < 0) {
      const { stdout: keyScan } = await execa("ssh-keyscan", [ resource ]);
      await fs.writeFile(knownHostFile, [knownHost, keyScan].join("\n"));
    }
  }

  public async isClean() {
    const { stdout } = await execa("git", ["status", "--porcelain"], { cwd: this.cwd });
    return stdout === "";
  }

  public async commitAndPush() {
    await execa("git", ["add", "-A", "."], { cwd: this.cwd, stdio: "inherit" });
    await execa("git", ["commit", "-m", "update"], { cwd: this.cwd, stdio: "inherit" });
    await execa("git", ["push", "origin", "master"], { cwd: this.cwd, stdio: "inherit" });
  }
}
