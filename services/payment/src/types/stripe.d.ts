import { Payment } from "@payment/types/payment";

export type CreateCheckoutSessionRequest = {
  total: number;

  user_id: string;
  name: string;
  email: string;
};
export type CreateCheckoutSessionResponse = {
  payment: Payment;
  url: string;
};
