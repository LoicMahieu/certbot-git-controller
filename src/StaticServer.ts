
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

  public listen() {
    this.app.listen(this.port);
  }

  private handleNotFound(req: express.Request, res: express.Response, next: express.NextFunction) {
    res
      .status(404)
      .send("Not found!");
  }
}
