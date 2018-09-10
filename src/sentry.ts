
import * as client from "raven";

export function setup(dsn: string | undefined): void {
  client.config(dsn, {
    captureUnhandledRejections: true,
  }).install();
}

export function captureException(e: Error, options?: client.CaptureOptions, cb?: client.CaptureCallback): void {
  client.captureException(e, options, cb);
}
