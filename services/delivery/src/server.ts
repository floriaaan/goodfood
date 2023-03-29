import "dotenv/config";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@delivery/lib/log";
import { options } from "@delivery/resources/protoloader-options";
import { serverInsecure } from "@delivery/resources/grpc-credentials";

import { CreateDelivery } from "@delivery/handlers/delivery";

const PORT = process.env.PORT || 50008;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = __dirname + "/../../proto/delivery.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const { delivery } = loadPackageDefinition(packageDefinition) as any; // todo: fix any
const server = new Server();

server.addService(delivery.DeliveryService.service, {
  // handlers
  // todo: add handlers
  CreateDelivery,
});

server.addService(delivery.DeliveryPersonService.service, {
  // handlers
  // todo: add handlers
});

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Delivery Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});
