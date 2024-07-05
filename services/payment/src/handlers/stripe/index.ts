import { UntypedServiceImplementation } from "@grpc/grpc-js";
import {
  CreateCheckoutSession,
  CreatePaymentIntent,
} from "@payment/handlers/stripe/create-checkout-session";

const stripeHandlers: UntypedServiceImplementation = {
  CreateCheckoutSession,

  CreatePaymentIntent,
};

export default stripeHandlers;
