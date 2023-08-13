import services from '../../proto/order_grpc_pb';
import * as grpc from '@grpc/grpc-js';

const url = process.env.GATEWAY_ORDER_URL || "localhost:50007";

export default new services.OrderServiceClient(
    url,
    grpc.credentials.createInsecure());