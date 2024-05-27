import {Payment} from "@payment/types/payment";

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

export type SetupIntentResponse = {
  setupIntent: string;
  ephemeralKey: string;
  customer: string;
};

export type CreatePaymentIntentRequest = {
  userMail: string;
  amount: number;
};

export type CreatePaymentIntentResponse = {
  setupIntent?: string;
  ephemeralKey?: string;
  customer: string;
};