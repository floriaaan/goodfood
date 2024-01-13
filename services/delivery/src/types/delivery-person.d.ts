import { Address } from "@delivery/types";
import { Delivery } from "@delivery/types/delivery";

export type DeliveryPersonAddress = Address & {
  delivery_person_id: string;
};

export type DeliveryPerson = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;

  address: DeliveryPersonAddress;

  deliveries: Delivery[];
};

export type DeliveryPersonCreateInput = {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;

  address: Omit<DeliveryPersonAddress, "id" | "delivery_person_id">;
};

export type LocationInput = {
  latitude: number;
  longitude: number;

  radius_in_km: number;
};

export type DeliveryPersonId = { id: DeliveryPerson["id"] };
export type DeliveryPersonUserId = { id: DeliveryPerson["id"] };

export type DeliveryPersonUpdateLocationInput = {
  delivery_person_id: string;
  latitude: number;
  longitude: number;
};
