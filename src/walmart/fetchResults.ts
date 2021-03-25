import * as TE from "fp-ts/lib/TaskEither";
import * as F from "fp-ts/function";
import * as Types from "../types";
import * as S from "./stores";
import * as A from "./appointments";
import * as H from "./headers";

export const fetchResults = (
  state: S.State,
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
