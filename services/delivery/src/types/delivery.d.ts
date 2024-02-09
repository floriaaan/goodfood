import { Address } from "@delivery/types";
import { DeliveryPerson } from "@delivery/types/delivery-person";
import { Status } from "@prisma/client";

export type DeliveryAddress = Address & {
  delivery_id: string;
};

export type RestaurantAddress = Omit<
  Address & {
    restaurant_id: string;
  },
  "id"
>;

export type DeliveryCreateInput = {
  address: Omit<DeliveryAddress, "id" | "delivery_id">;
  user_id: string;
  restaurant_id: string;
  restaurant_address: RestaurantAddress;
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
  restaurant_address: RestaurantAddress;
};

export type UserId = {
  id: string;
};

export type RestaurantId = {
  id: string;
};
