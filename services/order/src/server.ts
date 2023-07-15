import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@order/lib/log";
import { options } from "@order/resources/protoloader-options";
import { serverInsecure } from "@order/resources/grpc-credentials";
import { addReflection } from "@order/lib/reflection";
import { createServerProxy } from "@order/lib/proxy";
import { logGRPC } from "@order/middleware/log";
import orderHandlers from "@order/handlers/order";
import reportingHandlers from "@order/handlers/reporting";

const PORT = process.env.PORT || 50007;
const ADDRESS = `0.0.0.0:${PORT}`;

const PROTO_PATH = resolvePath(__dirname + "/../../proto/order.proto");
const REFLECTION_PATH = resolvePath(
  __dirname + "/../reflection_descriptor.bin"
);

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const { service: o_srv } = grpc.com.goodfood.order.OrderService;
const { service: r_srv } = grpc.com.goodfood.order.OrderReportingService;

// const server = new Server();

const server = createServerProxy(new Server());
server.addService(o_srv, orderHandlers);
server.addService(r_srv, reportingHandlers);
server.use(logGRPC);

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
