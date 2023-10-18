import { Delivery } from "@delivery/types/delivery";

export type DeliveryPerson = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: [number, number];

  deliveries: Delivery[];
};

export type DeliveryPersonCreateInput = {
  user_id: string,
  first_name: string;
  last_name: string;
  phone: string;
  location: [number, number];
};

export type LocationInput = {
  latitude: number;
  longitude: number;
};

export type DeliveryPersonId = { id: DeliveryPerson["id"] };
export type DeliveryPersonUserId = { id: DeliveryPerson["id"] };
