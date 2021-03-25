import { promises as fs } from "fs";

import path from "path";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

import * as F from "fp-ts/function";
import * as Types from "../types";
import { CT_STORE_DATA } from "./ct";

import * as t from "io-ts";

export const stores = (state: Types.State) => (): TE.TaskEither<
  string,
  Types.Store[]
> =>
  TE.fromEither(
    F.pipe(
      t.array(WalmartStore).decode(dataForState(state)),
      E.map((stores) =>
        stores.map(({ displayName, id }) => ({
          displayName,
          id: id.toString(),
        }))
      ),
      E.mapLeft((e) => `Could not decode stores ${JSON.stringify(e)}`)
    )
  );

function dataForState(state: Types.State) {
  switch (state) {
    case "CT":
      return CT_STORE_DATA;
    default:
      throw new Error(`unknown state ${state}`);
  }
}

const WalmartStore = t.type({
  id: t.number,
  displayName: t.string,
});
