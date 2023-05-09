import { CreateOrder } from "./create";
import { GetOrder } from "./get";
import { UpdateOrder } from "./update";
import { DeleteOrder } from "./delete";

const orderHandlers = {
  CreateOrder,
  GetOrder,
  UpdateOrder,
  DeleteOrder,
};

export default orderHandlers;
