import "dotenv/config";
import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "@notifications/lib/log";
import { options } from "@notifications/resources/protoloader-options";
import { serverInsecure } from "@notifications/resources/grpc-credentials";

import notificationHandler from "@notifications/handler";
import { createServerProxy } from "@notifications/lib/proxy";
import { logGRPC } from "@notifications/middleware/log";
import { subscribe } from "@notifications/lib/amqp";

const PORT = process.env.PORT || 50022;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = resolvePath(__dirname + "/../../proto/notification.proto");

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any;
const {
  NotificationService: { service: ns },
} = grpc.com.goodfood.notification;
subscribe();

const server = createServerProxy(new Server());
server.addService(ns, notificationHandler);
server.use(logGRPC);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
    "food"
  )} Notification Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
    "✓"
  )}\n`;
  log.debug(message);
});

export default server;
