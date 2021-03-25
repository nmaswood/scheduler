import * as TE from "fp-ts/lib/TaskEither";
import * as F from "fp-ts/function";
import * as Types from "../types";
import * as S from "./stores";
import * as A from "./appointments";
import * as H from "./headers";

export const fetchResults = (
  state: Types.State,
  email: string,
  password: string
): TE.TaskEither<string, Types.Result> =>
  F.pipe(
    S.stores(state)(),
    TE.chain((stores) =>
      F.pipe(
        H.headers(email, password)(),
        TE.chain((headers) =>
          F.pipe(
            A.appointments(headers)(stores.map((s) => s.id)),

            TE.map((appointments) => ({ stores, appointments }))
          )
        )
      )
    )
  );

export const fetchResultsWithDisplayName = (
  state: Types.State,
  email: string,
  password: string
): TE.TaskEither<
  string,
  {
    storeDisplayName: string;
    time: string;
  }[]
> =>
  F.pipe(
    fetchResults(state, email, password),
    TE.map(({ stores, appointments }) => {
      const byStoreId = stores.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
      }, {} as Record<string, Types.Store>);

      return appointments.map((a) => ({
        storeDisplayName: byStoreId[a.storeId].displayName,
        time: a.time,
      }));
    })
  );
