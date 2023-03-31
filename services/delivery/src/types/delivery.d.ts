import { DeliveryPerson } from "@delivery/types/delivery-person";
import { Status } from "@prisma/client";

export type Data<T> = {
  request: T;
};

export type Stream<T> = {
  write: (data: any) => void;
  end: () => void;
  request: T;
};

export type DeliveryCreateInput = {
  eta: string;
  address: string;

  status: Status;
  delivery_person_id: string;

  user_id: string;
  restaurant_id: string;
};

export type DeliveryId = {
  id: string;
};

export type Delivery = {
  id: string;
  eta: string;

  address: string;
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
