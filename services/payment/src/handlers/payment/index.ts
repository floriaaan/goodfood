import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { CreatePayment } from "@payment/handlers/payment/create";
import { GetPayment } from "@payment/handlers/payment/get";
import { GetPaymentsByUser } from "@payment/handlers/payment/get-user";
import { UpdatePayment } from "@payment/handlers/payment/update";

const paymentHandlers: UntypedServiceImplementation = {
  CreatePayment,
  GetPayment,
  GetPaymentsByUser,
  UpdatePayment,
};

export default paymentHandlers;
