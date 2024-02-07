import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@payment/lib/log";
import { options } from "@payment/resources/protoloader-options";
import { serverInsecure } from "@payment/resources/grpc-credentials";
import { addReflection } from "@payment/lib/reflection";
import { createServerProxy } from "@payment/lib/proxy";
import { logGRPC } from "@payment/middleware/log";
import paymentHandlers from "@payment/handlers/payment";
import stripeHandlers from "@payment/handlers/stripe";

const PORT = process.env.PORT || 50003;
const ADDRESS = `0.0.0.0:${PORT}`;

const PROTO_PATH = resolvePath(__dirname + "/../../proto/payment.proto");
const REFLECTION_PATH = resolvePath(
  __dirname + "/../reflection_descriptor.bin"
);

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const { service: p } = grpc.com.goodfood.payment.PaymentService;
const { service: s } = grpc.com.goodfood.payment.StripeService;

// const server = new Server();

const server = createServerProxy(new Server());
server.addService(p, paymentHandlers);
server.addService(s, stripeHandlers);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  addReflection(server, REFLECTION_PATH);
  const message =
    `---- ${utils.green("good")}${utils.yellow("food")} Payment Service ----` +
    `\n` +
    `started on: ${utils.bold(ADDRESS)} ${utils.green("✓")}`;
  log.debug(message);
});

export default server;
