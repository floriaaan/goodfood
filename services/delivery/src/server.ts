import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@delivery/lib/log";
import { options } from "@delivery/resources/protoloader-options";
import { serverInsecure } from "@delivery/resources/grpc-credentials";

import deliveryHandlers from "@delivery/handlers/delivery";
import personHandlers from "@delivery/handlers/person";
import { createServerProxy } from "@delivery/lib/proxy";
import { logGRPC } from "@delivery/middleware/log";

const PORT = process.env.PORT || 50008;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = resolvePath(__dirname + "/../../proto/delivery.proto");

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const {
  DeliveryService: { service: ds },
  DeliveryPersonService: { service: dps },
} = grpc.com.goodfood.delivery;

const server = createServerProxy(new Server());
server.addService(ds, deliveryHandlers);
server.addService(dps, personHandlers);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Delivery Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});

export default server;
