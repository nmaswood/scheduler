import { promises as fs } from "fs";

import path from "path";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

import * as F from "fp-ts/function";
import * as Types from "../types";

import * as t from "io-ts";

const PATH = path.join(__dirname, "..", "resources", "store-data.json");
export const stores = (): TE.TaskEither<string, Types.Store[]> =>
  F.pipe(
    TE.tryCatch(
      () => fs.readFile(PATH, "utf8"),
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

const WalmartStore = t.type({
  id: t.number,
  displayName: t.string,
});
