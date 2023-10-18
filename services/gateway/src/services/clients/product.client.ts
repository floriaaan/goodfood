import * as grpc from "@grpc/grpc-js";
import { AllergenServiceClient, CategoryServiceClient, ProductServiceClient } from "@gateway/proto/product_grpc_pb";

const url = process.env.GATEWAY_PRODUCT_URL || "localhost:50004";

export const categoryServiceClient = new CategoryServiceClient(url, grpc.credentials.createInsecure());

export const allergenServiceClient = new AllergenServiceClient(url, grpc.credentials.createInsecure());

export const productServiceClient = new ProductServiceClient(url, grpc.credentials.createInsecure());
