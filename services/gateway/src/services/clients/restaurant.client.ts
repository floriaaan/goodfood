import services from "../../proto/restaurant_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_RESTAURANT_URL || "localhost:50005";

export const restaurantServiceClient = new services.RestaurantServiceClient(url, grpc.credentials.createInsecure());
