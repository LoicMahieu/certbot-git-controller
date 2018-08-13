
import { Signale, SignaleBase } from "signale";

const logger = new Signale({
  config: {
    displayDate: true,
    displayTimestamp: true,
  },
});

export {
  SignaleBase,
};
export default logger;
