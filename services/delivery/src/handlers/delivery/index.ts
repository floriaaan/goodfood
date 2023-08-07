import { CreateDelivery } from "@delivery/handlers/delivery/create";
import { GetDelivery } from "@delivery/handlers/delivery/get";
import { UpdateDelivery } from "@delivery/handlers/delivery/update";
import { DeleteDelivery } from "@delivery/handlers/delivery/delete";
import { ListDeliveriesByUser } from "@delivery/handlers/delivery/list-by-user";
import { ListDeliveriesByRestaurant } from "@delivery/handlers/delivery/list-by-restaurant";

export default {
  CreateDelivery,
  GetDelivery,
  UpdateDelivery,
  DeleteDelivery,
  ListDeliveriesByUser,
  ListDeliveriesByRestaurant,
};
