import services from '../../proto/user_grpc_pb';
import * as grpc from "grpc";

export const userServiceClient = new services.UserServiceClient(
    'http://localhost:50001',
    grpc.credentials.createInsecure());

export const mainAddressServiceClient = new services.MainAddressServiceClient(
    'http://localhost:50001',
    grpc.credentials.createInsecure());