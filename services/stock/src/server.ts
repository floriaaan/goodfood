import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadPackageDefinition, Server } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

import { log, utils } from "@stock/lib/log";
import { createServerProxy } from "@stock/lib/proxy";
import { logGRPC } from "@stock/middleware/log";
import { serverInsecure } from "@stock/resources/grpc-credentials";
import { options } from "@stock/resources/protoloader-options";

import reportingHandlers from "@stock/handlers/reporting";
import stockHandlers from "@stock/handlers/stock";

const PORT = process.env.PORT || 50009;
const ADDRESS = `0.0.0.0:${PORT}`;

const PROTO_PATH = resolvePath(__dirname + "/../../proto/stock.proto");
const REFLECTION_PATH = resolvePath(
  __dirname + "/../reflection_descriptor.bin"
);

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const { service: s_srv } = grpc.com.goodfood.stock.StockService;
const { service: r_srv } = grpc.com.goodfood.stock.StockReportingService;

// const server = new Server();

const server = createServerProxy(new Server());
server.addService(s_srv, stockHandlers);
server.addService(r_srv, reportingHandlers);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  // addReflection(server, REFLECTION_PATH);
  const message =
    `---- ${utils.green("good")}${utils.yellow("food")} Stock Service ----` +
    `\n` +
    `started on: ${utils.bold(ADDRESS)} ${utils.green("✓")}\n`;
  log.debug(message);
});

export default server;
