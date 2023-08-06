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
  total: number;
  status: PaymentStatus;
  user: User;
  user_id: string;

  created_at: Date | string;
  updated_at: Date | string;
};
