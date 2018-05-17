
import * as express from "express";
import * as morgan from "morgan";
import { IControllerOptions } from "./controller";

export function createServer(options: IControllerOptions): express.Application {
  const app = express();

  app.use(morgan("tiny"));
  app.use(express.static(options.webroot));
  app.use(handleNotFound);

  return app;
}

function handleNotFound(req: express.Request, res: express.Response, next: express.NextFunction) {
  res
    .status(404)
    .send("Not found!");
}
