import { Prisma, Status } from "@prisma/client";

export type UserMinimum = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type Basket = {
  string: string;
  json?: string | Prisma.JsonValue | any;
};

export type Order = {
  id: string;
  payment_id: string;
  delivery_id: string;
  user: UserMinimum;
  basket_snapshot: Basket;
  status: Status;
};

export type GetOrderRequest = {
  id: string;
};

export type GetOrdersByUserRequest = {
  id: string;
};

export type GetOrdersByUserResponse = {
  orders: ExtendedOrder[];
};

export type GetOrderByDeliveryRequest = {
  id: string;
};

export type GetOrderByPaymentRequest = {
  id: string;
};

export type GetOrdersByStatusRequest = {
  status: Status;
};

export type GetOrdersByStatusResponse = {
  orders: ExtendedOrder[];
};

export type CreateOrderRequest = {
  payment_id: string;
  delivery_id: string;
  user: UserMinimum;
  basket_snapshot: Basket;
  restaurant_id: string;
};

export type UpdateOrderRequest = {
  id: string;
  payment_id: string;
  delivery_id: string;
  status: Status;
  restaurant_id: string;
};

export type DeleteOrderRequest = {
  id: string;
};

export type DeleteOrderResponse = {
  id: string;
};

export type ExtendedOrder = Order & {
  user: UserMinimum;
  basket_snapshot: Basket;
};