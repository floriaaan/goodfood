import services from '../../proto/payment_grpc_pb';
import * as grpc from '@grpc/grpc-js';

const url = process.env.GATEWAY_PAYMENT_URL || "localhost:50003";

export const paymentServiceClient = new services.PaymentServiceClient(
    url,
    grpc.credentials.createInsecure());

export const stripeServiceClient = new services.StripeServiceClient(
    url,
    grpc.credentials.createInsecure());