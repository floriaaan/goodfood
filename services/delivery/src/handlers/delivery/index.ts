import { CreateDelivery } from "@delivery/handlers/delivery/create";
import { DeleteDelivery } from "@delivery/handlers/delivery/delete";
import { GetDelivery } from "@delivery/handlers/delivery/get";
import { ListDeliveriesByDeliveryPerson } from "@delivery/handlers/delivery/list-by-delivery-person";
import { ListDeliveriesByRestaurant } from "@delivery/handlers/delivery/list-by-restaurant";
import { ListDeliveriesByUser } from "@delivery/handlers/delivery/list-by-user";
import { UpdateDelivery } from "@delivery/handlers/delivery/update";

export default {
  CreateDelivery,
  GetDelivery,
  UpdateDelivery,
  DeleteDelivery,
  ListDeliveriesByUser,
  ListDeliveriesByRestaurant,
  ListDeliveriesByDeliveryPerson,
};
