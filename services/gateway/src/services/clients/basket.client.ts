import services from '../../proto/basket_grpc_pb';
import * as grpc from '@grpc/grpc-js';

const url = process.env.GATEWAY_BASKET_URL || "localhost:50002";

export const basketServiceClient = new services.BasketServiceClient(
    url,
    grpc.credentials.createInsecure());