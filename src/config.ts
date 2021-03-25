import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as P from "fp-ts/lib/pipeable";

import * as Types from "./types";

export type Configuration = t.TypeOf<typeof Configuration>;

export const Configuration = t.type({
  port: t.string,
  host: t.string,
  walmartEmail: t.string,
  walmartPassword: t.string,
  state: Types.State,
  twilioAuthToken: t.string,
  twilioSid: t.string,
  twilioFrom: t.string,
  twilioTo: t.string,
});

export const CONFIGURATION: Configuration = P.pipe(
  Configuration.decode({
    port: process.env.PORT ?? "8080",
    host: process.env.HOST ?? "0.0.0.0",
    walmartEmail: process.env.WALMART_EMAIL,
    walmartPassword: process.env.WALMART_PASSWORD,
    state: process.env.STORES_IN_STATE ?? "CT",
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSid: process.env.TWILIO_SID,
    twilioFrom: process.env.TWILIO_FROM,
    twilioTo: process.env.TWILIO_TO,
  }),
  E.getOrElseW((e) => {
    throw new Error(`env variable not present: ${JSON.stringify(e, null, 2)}`);
  })
);
