import services from '../../proto/user_grpc_pb';
import * as grpc from "grpc";

export default new services.UserServiceClient(
    'http://localhost:50001',
    grpc.credentials.createInsecure());