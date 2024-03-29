import { Interval } from "@order/types";

export type GetOrdersAffluenceRequest = {
  date: string;
  restaurant_id: string;
};

export type GetOrdersAffluenceResponse = {
  average: number;
  total: number;
  min: number;
  max: number;

  orders_per_hour: number[];
};

export type GetTop5SellingProductsRequest = {
  date?: string;
  interval: Interval;
  restaurant_id: string;
};

export type ProductCount = {
  id: string;
  count: number;
};

export type GetTop5SellingProductsResponse = {
  products_count: ProductCount[];
};

export type GetDeliveryTypeRepartitionRequest = {
  date?: string;
  interval: Interval;
  restaurant_id: string;
};

export type GetDeliveryTypeRepartitionResponse = {
  delivery: number;
  takeaway: number;
};
