import { Status } from "@/types";
import { Delivery } from "@/types/delivery";
import { Payment } from "@/types/payment";

export type UserMinimum = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type Basket = {
  string: string;
  json?: string | object | any;
  total: number;
};

export enum DeliveryType {
  TAKEAWAY = "TAKEAWAY",
  DELIVERY = "DELIVERY",
}

export type Order = {
  id: string;
  delivery_type: DeliveryType;
  restaurant_id: string;
  user: UserMinimum;
  basket_snapshot: Basket;
  status: Status;

  payment_id: string;
  payment: Payment;

  delivery_id: string;
  delivery: Delivery;

  created_at: Date | string;
  updated_at: Date | string;
};
