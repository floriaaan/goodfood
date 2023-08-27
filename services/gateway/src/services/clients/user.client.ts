import services from "../../proto/user_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_USER_URL || "localhost:50001";

export const userServiceClient = new services.UserServiceClient(url, grpc.credentials.createInsecure());

export const mainAddressServiceClient = new services.MainAddressServiceClient(url, grpc.credentials.createInsecure());
