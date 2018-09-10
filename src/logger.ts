
import { wrap } from "lodash";
import { Signale, SignaleBase } from "signale";
import { captureException } from "./sentry";

const logger = new Signale({
  config: {
    displayDate: true,
    displayTimestamp: true,
  },
});

logger.error = wrap(logger.error, (fn, err) => {
  captureException(err);
  fn(err);
});

export {
  SignaleBase,
};
export default logger;
