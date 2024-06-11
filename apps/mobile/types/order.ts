import { Basket, BasketItem } from "@/types/basket";
import { Delivery } from "@/types/delivery";
import { Status } from "@/types/global";
import { Payment } from "@/types/payment";

export type UserMinimum = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export enum DeliveryType {
  DELIVERY = 0,
  TAKEAWAY = 1,
}

export type Order = {
  id: string;
  deliveryType: DeliveryType;
  restaurantId: string;
  user: UserMinimum;
  basketSnapshot: {
    string: string;
    json?: string | object | BasketSnapshot;
    total: number;
  };
  status: Status;

  paymentId: string;
  payment: Payment;

  deliveryId: string;
  delivery: Delivery;

  createdAt: Date | string;
  updatedAt: Date | string;
};

export type BasketSnapshot = Omit<Basket, "productsList"> & {
  productsList: (BasketItem & {
    price: number;
    name: string;
  })[];
};
