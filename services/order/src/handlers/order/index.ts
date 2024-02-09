import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { CreateOrder } from "@order/handlers/order/create";
import { DeleteOrder } from "@order/handlers/order/delete";
import { GetOrder } from "@order/handlers/order/get";
import { UpdateOrder } from "@order/handlers/order/update";

import { GetOrderByDelivery } from "@order/handlers/order/get-delivery";
import { GetOrderByPayment } from "@order/handlers/order/get-payment";
import { GetOrdersByRestaurant } from "@order/handlers/order/get-restaurant";
import { GetOrdersByStatus } from "@order/handlers/order/get-status";

import { GetOrdersByUser } from "@order/handlers/order/get-user";

const orderHandlers: UntypedServiceImplementation = {
  CreateOrder,
  GetOrder,
  UpdateOrder,
  DeleteOrder,

  GetOrdersByUser,
  GetOrderByDelivery,
  GetOrderByPayment,
  GetOrdersByStatus,
  GetOrdersByRestaurant,
};

export default orderHandlers;
