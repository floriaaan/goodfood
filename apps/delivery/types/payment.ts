export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Payment = {
  id: string;
  stripe_id: string;
  total: number;
  status: PaymentStatus;
  user: User;
  user_id: string;

  createdAt: Date | string;
  updatedAt: Date | string;
};
