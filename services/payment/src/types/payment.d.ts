// import { Prisma } from "@prisma/client";

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

export type CreatePaymentRequest = {
  total: number;

  user_id: string;
  name: string;
  email: string;
};

export type UpdatePaymentRequest = {
  id: string;
  status: PaymentStatus;
};
