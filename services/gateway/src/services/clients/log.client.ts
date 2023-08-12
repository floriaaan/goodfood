import services from '../../proto/log_grpc_pb';
import * as grpc from '@grpc/grpc-js';

// TODO: add log env
export const logServiceClient = new services.LogServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());