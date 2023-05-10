import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { CreateOrder } from "./create";
import { GetOrder } from "./get";
import { UpdateOrder } from "./update";
import { DeleteOrder } from "./delete";

const orderHandlers: UntypedServiceImplementation = {
  CreateOrder,
  GetOrder,
  UpdateOrder,
  DeleteOrder,
};

export default orderHandlers;
