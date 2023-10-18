import { CreateDeliveryPerson } from "@delivery/handlers/person/create";
import { GetDeliveryPerson } from "@delivery/handlers/person/get";
import { GetDeliveryPersonByUser } from "@delivery/handlers/person/get-user";
import { UpdateDeliveryPerson } from "@delivery/handlers/person/update";
import { DeleteDeliveryPerson } from "@delivery/handlers/person/delete";
import { ListDeliveryPersons } from "@delivery/handlers/person/list";
import { ListNearDeliveryPersons } from "@delivery/handlers/person/list-near";

export default {
  CreateDeliveryPerson,
  GetDeliveryPersonByUser,
  GetDeliveryPerson,
  UpdateDeliveryPerson,
  DeleteDeliveryPerson,
  ListDeliveryPersons,
  ListNearDeliveryPersons,
};
