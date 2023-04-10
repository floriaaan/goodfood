import { mockDeep } from "vitest-mock-extended";
import { Delivery, Prisma, PrismaClient } from "@prisma/client";

// Mock the PrismaClient
const prismaMock = mockDeep<PrismaClient>();

// Mock the Delivery model's `create` method
//@ts-ignore
prismaMock.delivery.create.mockImplementation(async ({ data }: Prisma.DeliveryCreateArgs) => {
  const createdDelivery: Delivery = {
    address: data.address,
    eta: data.eta as Date,
    user_id: data.user_id,
    restaurant_id: data.restaurant_id,
    // @ts-ignore
    person: data.person,
    id: "random_id", // set an example ID
    status: "PENDING", // set an example status
  };
  return createdDelivery;
});

export default prismaMock;
