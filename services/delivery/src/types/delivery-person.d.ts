import { Delivery } from "@delivery/types/delivery";

export type DeliveryPerson = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: [number, number];

  deliveries: Delivery[];
};

export type DeliveryPersonCreateInput = {
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
