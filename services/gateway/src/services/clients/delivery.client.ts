import services from "../../proto/delivery_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_DELIVERY_URL || "localhost:50008";

export const deliveryServiceClient = new services.DeliveryServiceClient(url, grpc.credentials.createInsecure());

export const deliveryPersonServiceClient = new services.DeliveryPersonServiceClient(
  url,
  grpc.credentials.createInsecure(),
);
