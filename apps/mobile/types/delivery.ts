import { Status } from "@/types/global";

export type Delivery = {
  id: string;
  eta: string;

  address: Address;
  status: Status;

  deliveryPerson: DeliveryPerson;
  delivery_person_id: string;

  user_id: string;
  restaurant_id: string;
};

export type DeliveryPerson = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;

  deliveries?: Delivery[];
};

export type Address = {
  lat: number;
  lng: number;

  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;
};
