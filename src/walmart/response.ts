import * as S from "./stores";
import * as H from "./headers";
import * as A from "./appointments";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as Types from "../types";

const checkAllStores = async (
  email: string,
  password: string,
  state: S.State
) => {
  const res = F.pipe(
    S.stores(state)(),
    TE.map((stores) => {
      const storesById = stores.reduce((acc, element) => {
        acc[element.id] = element;
        return acc;
      }, {} as Record<string, Types.Store>);

      return undefined!;
    })
  );

  const stores = await S.stores(state)()();
  const headers = await H.headers(email, password)()();
};
