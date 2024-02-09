import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@basket/lib/log";
import { options } from "@basket/resources/protoloader-options";
import { serverInsecure } from "@basket/resources/grpc-credentials";

import basketHandlers from "@basket/handlers/basket";
import { createServerProxy } from "@basket/lib/proxy";
import { logGRPC } from "@basket/middleware/log";

const PORT = process.env.PORT || 50002;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = resolvePath(__dirname + "/../../proto/basket.proto");

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const {
  BasketService: { service: bs },
} = grpc.com.goodfood.basket;

const server = createServerProxy(new Server());
server.addService(bs, basketHandlers);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Basket Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});

export default server;
