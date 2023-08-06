import { Status } from "@/types";

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

export type DeliveryPerson = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: [number, number];

  deliveries?: Delivery[];
};
