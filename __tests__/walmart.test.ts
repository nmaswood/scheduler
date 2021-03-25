import * as E from "fp-ts/lib/Either";
import * as Walmart from "../src/walmart";

describe("walmart", () => {
  test("connecticut stores", async () => {
    const ctStores = await Walmart.stores("CT")()();
    expect(E.isRight(ctStores)).toEqual(true);
  });

  test("fetch headers from walmart", async () => {
    const email = process.env.WALMART_EMAIL;
    const password = process.env.WALMART_PASSWORD;
    if (email == null || password == null) {
      return;
    }

    const headers = await Walmart.headers(email, password)()();
    expect(E.isRight(headers)).toEqual(true);
    if (E.isLeft(headers)) {
      throw new Error("invalid");
    }

    const BRISTOL = "2719";

    const appointment = await Walmart.appointment(headers.right)(BRISTOL)();

    expect(E.isRight(appointment)).toEqual(true);
  }, 60000);
});
