import fastify from "fastify";

import * as Walmart from "./walmart";
import * as C from "./config";
import * as E from "fp-ts/lib/Either";
import * as SMS from "./sms";

const server = fastify();

const MESSAGE_SENDER = SMS.sendMessage(
  C.CONFIGURATION.twilioSid,
  C.CONFIGURATION.twilioAuthToken,
  C.CONFIGURATION.twilioFrom,
  C.CONFIGURATION.twilioTo
);

server.get("/", async () => "OKAY");
server.get("/ping", async () => "pong");
server.get("/results", async (_, reply) => {
  const result = await Walmart.fetchResultsWithDisplayName(
    C.CONFIGURATION.state,
    C.CONFIGURATION.walmartEmail,
    C.CONFIGURATION.walmartPassword
  )();

  if (E.isRight(result)) {
    await MESSAGE_SENDER(result.right);
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(result.right);
  } else {
    reply.code(500).send(result.left);
  }
});

server.listen(C.CONFIGURATION.port, C.CONFIGURATION.host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening at ${address}`);
});
