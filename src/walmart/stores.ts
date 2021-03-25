import { promises as fs } from "fs";

import path from "path";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

import * as F from "fp-ts/function";
import * as Types from "../types";

import * as t from "io-ts";

export type State = "CT";

export const stores = (state: State) => (): TE.TaskEither<
  string,
  Types.Store[]
> =>
  F.pipe(
    TE.tryCatch(
      () => fs.readFile(pathFromState(state), "utf8"),
      (e) => `Could not read store data ${e}`
    ),
    TE.map(JSON.parse),
    TE.chain((json) =>
      TE.fromEither(
        F.pipe(
          t.array(WalmartStore).decode(json),
          E.map((stores) =>
            stores.map((store) => ({ ...store, id: store.id.toString() }))
          ),
          E.mapLeft((e) => `Could not decode stores ${JSON.stringify(e)}`)
        )
      )
    )
  );

function pathFromState(state: State): string {
  switch (state) {
    case "CT":
      return withPrefix("ct-store-data.json");
    default:
      throw new Error(`unknown state ${state}`);
  }
}

function withPrefix(name: string): string {
  return path.join(__dirname, "..", "..", "resources", name);
}
const WalmartStore = t.type({
  id: t.number,
  displayName: t.string,
});
