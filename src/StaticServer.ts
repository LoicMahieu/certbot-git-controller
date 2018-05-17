
import * as express from "express";
import * as morgan from "morgan";
import { IControllerOptions } from "./controller";

export default
class GitRepository {
  public readonly port: number;
  private readonly app: express.Application;

  constructor(options: IControllerOptions) {
    this.port = options.port;
    this.app = express();

    this.app.use(morgan("tiny"));
    this.app.use(express.static(options.webroot));
    this.app.use(this.handleNotFound);
  }

  public async listen() {
    await new Promise((resolve, reject) => {
      this.app.listen(this.port, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private handleNotFound(req: express.Request, res: express.Response, next: express.NextFunction) {
    res
      .status(404)
      .send("Not found!");
  }
}
