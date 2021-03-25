import * as TE from "fp-ts/lib/TaskEither";
import * as F from "fp-ts/function";

import puppeteer from "puppeteer";

export const headers = (email: string, password: string) => () =>
  F.pipe(
    TE.tryCatch(
      login(email, password),
      (e) => `Could not login: ${JSON.stringify(e)}`
    ),
    TE.map(cookieString),
    TE.map((cookie) => ({
      ...FIXED_HEADERS,
      cookie,
    }))
  );

interface Cookie {
  name: string;
  value: string;
}

const cookieString = (cookies: Cookie[]) =>
  cookies.map(({ name, value }) => `${name}=${value}`).join("; ");

const login = (email: string, password: string) => async (): Promise<
  Cookie[]
> => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto(
    "https://www.walmart.com/account/login?tid=0&returnUrl=%2Feasyreorder",

    { waitUntil: "networkidle2" }
  );

  await page.waitForSelector("#email");
  await page.waitForSelector("#password");

  await page.type("#email", email);
  await page.type("#password", password);

  await page.click("#sign-in-form > button:first-of-type");

  await page.waitForSelector("#global-search-form");

  const cookies = await page.cookies();
  await browser.close();

  return cookies.map(({ name, value }) => ({ name, value }));
};

const FIXED_HEADERS = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json",
  "rx-electrode": "true",
  "sec-ch-ua":
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "wpharmacy-source":
    "web/chrome89.0.4389/OS X 11.2.3/07c9b217-f2a5-4155-8ea6-1021a9d973c3",
  "wpharmacy-trackingid": "b9abcfa3-1219-4ffb-be09-2b1a15fb712c",
} as const;
