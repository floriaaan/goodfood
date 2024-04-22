import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { GetPayment } from "@payment/handlers/payment/get";
import { GetPaymentsByUser } from "@payment/handlers/payment/get-user";
import { GetPaymentsByStripe } from "@payment/handlers/payment/get-stripe";
import { UpdatePaymentStatus } from "@payment/handlers/payment/put";

const paymentHandlers: UntypedServiceImplementation = {
  GetPayment,
  GetPaymentsByUser,
  GetPaymentsByStripe,
  UpdatePaymentStatus
};

export default paymentHandlers;
