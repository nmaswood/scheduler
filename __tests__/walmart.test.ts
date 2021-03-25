import * as F from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as Walmart from "../src/walmart";

describe("walmart", () => {
  test("connecticut stores", async () => {
    const ctStores = await Walmart.stores("CT")()();
    expect(E.isRight(ctStores)).toEqual(true);
  });
  const email = process.env.WALMART_EMAIL;
  const password = process.env.WALMART_PASSWORD;

  if (email == null || password == null) {
    return;
  }

  xit("fetch headers from walmart", async () => {
    const headers = await Walmart.headers(email, password)()();
    expect(E.isRight(headers)).toEqual(true);
  }, 60000);

  xit("fetch appointments from walmart", async () => {
    const headers = await Walmart.headers(email, password)()();
    expect(E.isRight(headers)).toEqual(true);
    if (E.isLeft(headers)) {
      throw new Error("invalid");
    }

    const STORE_IDS = ["2719"];

    const appointment = await Walmart.appointments(headers.right)(STORE_IDS)();

    expect(E.isRight(appointment)).toEqual(true);
  }, 60000);

  test("fetch appointments from walmart", async () => {
    const result = await Walmart.fetchResults("CT", email, password)();

    expect(E.isRight(result)).toEqual(true);
    if (!E.isRight(result)) {
      throw new Error("impossible");
    }

    console.log(JSON.stringify(result.right, null, 2));
  }, 60000);
});
