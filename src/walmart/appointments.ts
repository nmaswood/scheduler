import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as P from "fp-ts/lib/pipeable";

import * as F from "fp-ts/function";

import axios from "axios";
import * as Types from "../types";

import * as t from "io-ts";

export const appointments = (headers: Record<string, string>) => (
  storeIds: string[]
): TE.TaskEither<string, Types.Appointment[]> =>
  F.pipe(
    storeIds.map((storeId) => appointment(headers)(storeId)),
    TE.sequenceArray,
    TE.map((results) => results.flat())
  );

const appointment = (headers: Record<string, string>) => (
  storeId: string
): TE.TaskEither<string, Types.Appointment[]> =>
  F.pipe(
    TE.tryCatch(
      () =>
        axios.post<{ data: unknown }>(SCHEDULING_URL, requestBody(storeId), {
          headers,
        }),
      (error) =>
        `Could not make request to walmart API: ${JSON.stringify(error)}`
    ),
    TE.chain((response) =>
      TE.fromEither(
        P.pipe(
          response.data.data,
          AppointmentResponse.decode,
          E.map(fromAppointmentResponse(storeId)),
          E.mapLeft(
            (errors) => `Could not decode response: ${JSON.stringify(errors)}`
          )
        )
      )
    )
  );

const fromAppointmentResponse = (storeId: string) => (
  response: AppointmentResponse
): Types.Appointment[] =>
  response.slotDays
    .filter(
      (s) =>
        !(
          typeof s.message === "string" &&
          s.message.startsWith("There are no appointments")
        )
    )
    .map(({ slotDate, message }) => ({ message, storeId, time: slotDate }));

type AppointmentResponse = t.TypeOf<typeof AppointmentResponse>;
const AppointmentResponse = t.type({
  slotDays: t.array(
    t.type({
      message: t.union([t.string, t.null]),
      slotDate: t.string,
    })
  ),
});

function requestBody(storeId: string) {
  const now = new Date();
  const fiveDays = addDays(now, 5);
  return {
    imzStoreNumber: {
      USStoreId: Number(storeId),
    },
    startDate: formatDate(now),
    endDate: formatDate(fiveDays),
  } as const;
}

const YEAR = new Intl.DateTimeFormat("en", { year: "numeric" });
const MONTH = new Intl.DateTimeFormat("en", { month: "2-digit" });
const DAY = new Intl.DateTimeFormat("en", { day: "2-digit" });

const addDays = (d: Date, days: number) => {
  const clone = new Date(d.getTime());
  clone.setDate(clone.getDate() + days);
  return clone;
};

const formatDate = (date: Date): string =>
  `${MONTH.format(date)}${DAY.format(date)}${YEAR.format(date)}`;

const SCHEDULING_URL =
  "https://www.walmart.com/pharmacy/v2/clinical-services/time-slots/07c9b217-f2a5-4155-8ea6-1021a9d973c3";
