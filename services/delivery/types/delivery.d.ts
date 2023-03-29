import { Status } from "@prisma/client";

export type DeliveryCreateInput = {
  eta: {
    seconds: number;
    nano: number;
  };
  address: string;
  status: Status;
  delivery_person_id: string;
};
