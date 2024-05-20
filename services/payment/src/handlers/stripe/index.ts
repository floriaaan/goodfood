import {
  CreateCheckoutSession,
  CreatePaymentIntent,
  CreateSetupIntent,
} from "@payment/handlers/stripe/create-checkout-session";
import { UntypedServiceImplementation } from "@grpc/grpc-js";

const stripeHandlers: UntypedServiceImplementation = {
  CreateCheckoutSession,
  CreateSetupIntent,
  CreatePaymentIntent,
};

export default stripeHandlers;