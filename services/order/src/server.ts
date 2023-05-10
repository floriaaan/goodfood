import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@order/lib/log";
import { options } from "@order/resources/protoloader-options";
import { serverInsecure } from "@order/resources/grpc-credentials";
import { addReflection } from "@order/lib/reflection";
import orderHandlers from "@order/handlers/order";

const PORT = process.env.PORT || 50007;
const ADDRESS = `0.0.0.0:${PORT}`;

const PROTO_PATH = resolvePath(__dirname + "/../../proto/order.proto");
const REFLECTION_PATH = resolvePath(
  __dirname + "/../reflection_descriptor.bin"
);

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const { service } = grpc.com.goodfood.order.OrderService;

const server = new Server();
server.addService(service, orderHandlers);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  addReflection(server, REFLECTION_PATH);
  const message =
    `---- ${utils.green("good")}${utils.yellow("food")} Order Service ----` +
    `\n` +
    `started on: ${utils.bold(ADDRESS)} ${utils.green("✓")}\n`;
  log.debug(message);
});

export default server;
