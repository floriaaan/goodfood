import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { CreateOrder } from "@order/handlers/order/create";
import { GetOrder } from "@order/handlers/order/get";
import { UpdateOrder } from "@order/handlers/order/update";
import { DeleteOrder } from "@order/handlers/order/delete";

import { GetOrdersByUser } from "@order/handlers/order/get-user";
import { GetOrderByDelivery } from "@order/handlers/order/get-delivery";
import { GetOrderByPayment } from "@order/handlers/order/get-payment";
import { GetOrdersByStatus } from "@order/handlers/order/get-status";

import { GetOrdersAffluence } from "@order/handlers/order/affluence";

const orderHandlers: UntypedServiceImplementation = {
  CreateOrder,
  GetOrder,
  UpdateOrder,
  DeleteOrder,

  GetOrdersByUser,
  GetOrderByDelivery,
  GetOrderByPayment,
  GetOrdersByStatus,

  GetOrdersAffluence,
};

export default orderHandlers;
