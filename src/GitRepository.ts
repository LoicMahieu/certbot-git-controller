
import * as execa from "execa";
import * as fs from "fs-extra";
import * as path from "path";

const gitEnv = {
  ...process.env,
  GIT_SSH_COMMAND: "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no",
};

export default
class GitRepository {
  private readonly remote: string;
  private readonly cwd: string;
  private readonly commitMessage: string;

  constructor(remote: string, cwd: string, commitMessage?: string) {
    this.remote = remote;
    this.cwd = cwd;
    this.commitMessage = commitMessage || "Update Let's Encrypt store";
  }

  public async createRepositoryIfNeeded(clean: boolean) {
    if (clean && await fs.pathExists(this.cwd)) {
      await fs.remove(this.cwd);
    }
    await fs.ensureDir(this.cwd);

    // Clone repository if not exists
    if (!await fs.pathExists(path.join(this.cwd, ".git"))) {
      await execa("git", [
        "clone",
        this.remote,
        this.cwd,
      ], { stdio: "inherit", env: gitEnv });
    }

    // Fetch origin
    await execa("git", ["fetch", "origin"], { cwd: this.cwd, stdio: "inherit", env: gitEnv });

    // Reset hard to master
    await execa("git", ["reset", "--hard", "origin/master"], { cwd: this.cwd, stdio: "inherit", env: gitEnv });
  }

  public async isClean() {
    const { stdout } = await execa("git", ["status", "--porcelain"], { cwd: this.cwd , env: gitEnv});
    return stdout === "";
  }

  public async commitAndPush() {
    await execa("git", ["add", "-A", "."], { cwd: this.cwd, stdio: "inherit", env: gitEnv });
    await execa("git", ["commit", "-m", this.commitMessage], { cwd: this.cwd, stdio: "inherit", env: gitEnv });
    await execa("git", ["push", "origin", "master"], { cwd: this.cwd, stdio: "inherit", env: gitEnv });
  }
}
