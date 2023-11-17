import services from "../../proto/promotions_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_PROMOTION_URL || "localhost:50006";

export const promotionServiceClient = new services.PromotionServiceClient(url, grpc.credentials.createInsecure());
