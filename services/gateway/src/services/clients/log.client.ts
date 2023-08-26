import services from "../../proto/log_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_LOG_URL || "localhost:50021";

export const logServiceClient = new services.LogServiceClient(url, grpc.credentials.createInsecure());
