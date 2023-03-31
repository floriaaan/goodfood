import { Delivery } from "@delivery/types/delivery";

export type DeliveryPerson = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: [number, number];

  deliveries: Delivery[];
};
