import services from '../../proto/delivery_grpc_pb';
import * as grpc from '@grpc/grpc-js';

// TODO: add delivery env
export const deliveryServiceClient = new services.DeliveryServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());

export const deliveryPersonServiceClient = new services.DeliveryPersonServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());