import services from '../../proto/order_grpc_pb';
import * as grpc from '@grpc/grpc-js';

// TODO: add order env
export default new services.OrderServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());