import { Address } from "@delivery/types";
import { DeliveryPerson } from "@delivery/types/delivery-person";
import { Status } from "@prisma/client";

export type DeliveryAddress = Address & {
  delivery_id: string;
};

export type DeliveryCreateInput = {
  eta: string;
  address: Omit<DeliveryAddress, "id" | "delivery_id">;

  status: Status;
  delivery_person_id: string;

  user_id: string;
  restaurant_id: string;
};

export type DeliveryId = {
  id: Delivery["id"];
};

export type Delivery = {
  id: string;
  eta: string;

  address: DeliveryAddress;
  status: Status;

  person: DeliveryPerson;
  delivery_person_id: string;

  user_id: string;
  restaurant_id: string;
};

export type UserId = {
  id: string;
};

export type RestaurantId = {
  id: string;
};
