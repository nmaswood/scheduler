import fastify from "fastify";
import * as Walmart from "./walmart";
import * as C from "./config";
import * as E from "fp-ts/lib/Either";

import * as TE from "fp-ts/lib/TaskEither";
import * as F from "fp-ts/function";

const server = fastify();
const port = process.env.PORT ?? "8080";
const host = process.env.HOST ?? "0.0.0.0";

server.get("/", async () => "OKAY");
server.get("/ping", async () => "pong");
server.get("/results", async (_, reply) => {
  const result = await Walmart.fetchResultsWithDisplayName(
    C.CONFIGURATION.state,
    C.CONFIGURATION.walmartEmail,
    C.CONFIGURATION.walmartPassword
  )();

  if (E.isRight(result)) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(result.right);
  } else {
    reply.code(500).send(result.left);
  }
});

server.listen(port, host, (err, address) => {
  console.log(host);
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening at ${address}`);
});
