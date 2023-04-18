import "dotenv/config";

import { loadSync } from "@grpc/proto-loader";
import { ServerCredentials, loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "./lib/log";

import AllergenHandler from "./handler/Allergen/index";
import CategoryHandler from "./handler/Category/index";
import ProductHandler from "./handler/Product/index";

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

const serverInsecure = ServerCredentials.createInsecure();

const PORT = process.env.PORT || 50008;
const ADDRESS = `0.0.0.0:${PORT}`;
const PROTO_PATH = __dirname + "/../../proto/product.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const { delivery } = loadPackageDefinition(packageDefinition) as any; // todo: fix any
const server = new Server();

server.addService(delivery.AllergenService.service, AllergenHandler);
server.addService(delivery.CategoryService.service, CategoryHandler);
server.addService(delivery.ProductService.service, ProductHandler);

server.bindAsync(ADDRESS, serverInsecure, () => {
  server.start();
  const message = `---- ${utils.green("good")}${utils.yellow(
	"food"
  )} Product Service ----\nstarted on: ${utils.bold(ADDRESS)} ${utils.green(
	"✓"
  )}\n`;
  log.debug(message);
});


export default server;