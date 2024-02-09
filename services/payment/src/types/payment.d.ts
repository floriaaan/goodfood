import { PaymentStatus } from "@prisma/client";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Payment = {
  id: string;
  total: number;
  status: PaymentStatus;
  user: User;
  user_id: string;

  created_at: Date | string;
  updated_at: Date | string;
};

export type GetPaymentRequest = {
  id: string;
};

export type GetPaymentsByUserRequest = {
  id: string;
};

export type GetPaymentsByUserResponse = {
  payments: Payment[];
};

export type GetPaymentsByStripeRequest = {
  id: string;
};

export type GetPaymentsByStripeResponse = {
  payments: Payment[];
};

export type UpdatePaymentStatusRequest = {
  id: string;
  status: PaymentStatus;
};