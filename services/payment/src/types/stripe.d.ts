import { Payment } from "@payment/types/payment";

export type CreateCheckoutSessionRequest = {
  total: number;
  return_url_base: string;
  user_id: string;
  name: string;
  email: string;
};
export type CreateCheckoutSessionResponse = {
  payment: Payment;
  clientSecret: string;
};
