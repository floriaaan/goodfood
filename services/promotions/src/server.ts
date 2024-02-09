import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@promotions/lib/log";
import { options } from "@promotions/resources/protoloader-options";
import { serverInsecure } from "@promotions/resources/grpc-credentials";

import promotionHandler from "@promotions/handler";
import { createServerProxy } from "@promotions/lib/proxy";
import { logGRPC } from "@promotions/middleware/log";

const PORT = process.env.PORT || 50006;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = resolvePath(__dirname + "/../../proto/promotions.proto");

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const {
  PromotionService: { service: ds },
} = grpc.com.goodfood.promotions;

const server = createServerProxy(new Server());
server.addService(ds, promotionHandler);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Promotions Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});

export default server;
