import services from '../../proto/promotions_grpc_pb';
import * as grpc from "grpc";

// TODO: add promotions env
export const promotionsServiceClient = new services.PromotionServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());