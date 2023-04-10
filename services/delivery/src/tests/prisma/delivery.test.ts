import prisma from "@delivery/lib/mocks/prisma";
import { Prisma, Status } from "@prisma/client";
import { expect, test } from "vitest";



test("PRISMA: create a Delivery object", async () => {
  const input: Prisma.DeliveryCreateInput = {
    address: "123 Main St",
    eta: new Date(),

    user_id: "random_user_id",
    restaurant_id: "random_restaurant_id",

    person: {
      create: {
        first_name: "Food",
        last_name: "Good",
        phone: "123456789",
      },
    },
  };
  

  const delivery = await prisma.delivery.create({
    data: input,
  });



  expect(delivery).toStrictEqual({
    ...input,
    id: 1,
    status: Status.PENDING,
  });
});
