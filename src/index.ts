import fastify from "fastify";

const server = fastify();
const port = process.env.PORT ?? "8080";
const host = process.env.HOST ?? "0.0.0.0";

server.get("/", async (request, reply) => {
  return { hello: "world!" };
});

server.listen(port, host, (err, address) => {
  console.log(host);
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening at ${address}`);
});
