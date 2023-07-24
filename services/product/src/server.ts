import { resolve as resolvePath } from "path";

import { loadSync } from "@grpc/proto-loader";
import { ServerCredentials, loadPackageDefinition, Server } from "@grpc/grpc-js";

import { log, utils } from "./lib/log";

import { logGRPC } from "@product/middleware/log";

import { createServerProxy } from "@product/lib/proxy";

import AllergenHandler from "@product/handler/Allergen/index";
import CategoryHandler from "@product/handler/Category/index";
import ProductHandler from "@product/handler/Product/index";

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

const serverInsecure = ServerCredentials.createInsecure();

const PORT = process.env.PORT || 50004;
const ADDRESS = `localhost:${PORT}`;
const PROTO_PATH = "../proto/product.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const grpc = loadPackageDefinition(packageDefinition) as any; // todo: fix any
const serviceAllergen = grpc.com.goodfood.product.AllergenService.service;
const serviceCategory = grpc.com.goodfood.product.CategoryService.service;
const serviceProduct = grpc.com.goodfood.product.ProductService.service;

const server = createServerProxy(new Server());

server.addService(serviceAllergen, AllergenHandler);
server.addService(serviceCategory, CategoryHandler);
server.addService(serviceProduct, ProductHandler);

server.use(logGRPC);

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