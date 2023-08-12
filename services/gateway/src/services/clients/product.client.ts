import * as grpc from '@grpc/grpc-js';
import {AllergenServiceClient, CategoryServiceClient, ProductServiceClient} from "@gateway/proto/product_grpc_pb";

// TODO: add order env
export const categoryServiceClient = new CategoryServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());

export const allergenServiceClient = new AllergenServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());

export const productServiceClient = new ProductServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());