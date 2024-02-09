import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@restaurant/lib/log";
import { options } from "@restaurant/resources/protoloader-options";
import { serverInsecure } from "@restaurant/resources/grpc-credentials";

import restaurantHandler from "@restaurant/handler";
import { createServerProxy } from "@restaurant/lib/proxy";
import { logGRPC } from "@restaurant/middleware/log";

const PORT = process.env.PORT || 50005;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = resolvePath(__dirname + "/../../proto/restaurant.proto");

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const {
  RestaurantService: { service: rs },
} = grpc.com.goodfood.restaurant;

const server = createServerProxy(new Server());
server.addService(rs, restaurantHandler);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Restaurant Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});

export default server;
