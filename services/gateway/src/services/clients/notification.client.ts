import services from "../../proto/notification_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const url = process.env.GATEWAY_NOTIFICATION_URL || "localhost:50022";

export const notificationServiceClient = new services.NotificationServiceClient(url, grpc.credentials.createInsecure());
