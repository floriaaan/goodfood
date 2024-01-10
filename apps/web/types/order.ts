import { Status } from "@/types/global";
import { Delivery } from "@/types/delivery";
import { Payment } from "@/types/payment";
import { Basket, BasketItem } from "@/types/basket";

export type UserMinimum = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  basket_snapshot: {
    string: string;
    json?: string | object | BasketSnapshot;
    total: number;
  };
  status: Status;

  payment_id: string;
  payment: Payment;

  delivery_id: string;
  delivery: Delivery;

  created_at: Date | string;
  updated_at: Date | string;
};

export type BasketSnapshot = Omit<Basket, "products"> & {
  products: (BasketItem & {
    price: number;
    name: string;
  })[];
};
