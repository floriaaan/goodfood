import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { GetPayment } from "@payment/handlers/payment/get";
import { GetPaymentsByUser } from "@payment/handlers/payment/get-user";

const paymentHandlers: UntypedServiceImplementation = {
  GetPayment,
  GetPaymentsByUser,
};

export default paymentHandlers;
