import { PrismaClient, Prisma, Status } from "@prisma/client";

const prisma = new PrismaClient();

const orders: Prisma.OrderCreateInput[] = [
  {
    id: "order_id:1",
    payment_id: "payment_id:1",
    delivery_id: "delivery_id:1",
    user: {
      connectOrCreate: {
        where: { id: "user_id:1" },
        create: {
          id: "user_id:1",
          first_name: "John",
          last_name: "Doe",
          email: "john@doe.com",
          phone: "0612345678",
        },
      },
    },
    basket_snapshot: {
      create: {
        json: {},
        string: JSON.stringify({}),
        total: 0,
      },
    },
    status: Status.PENDING,
  },
  {
    id: "order_id:2",
    payment_id: "payment_id:2",
    delivery_id: "delivery_id:2",
    user: {
      connectOrCreate: {
        where: { id: "user_id:1" },
        create: {
          id: "user_id:1",
          first_name: "John",
          last_name: "Doe",
          email: "john@doe.com",
          phone: "0612345678",
        },
      },
    },
    basket_snapshot: {
      create: {
        json: {},
        string: JSON.stringify({}),
        total: 0,
      },
    },
    status: Status.FULFILLED,
  },
  {
    id: "order_id:3",
    payment_id: "payment_id:3",
    delivery_id: "delivery_id:3",
    user: {
      connectOrCreate: {
        where: { id: "user_id:2" },
        create: {
          id: "user_id:2",
          first_name: "Foonie",
          last_name: "Garbage",
          email: "foo@gar.com",
          phone: "0612345678",
        },
      },
    },
    basket_snapshot: {
      create: {
        json: {},
        string: JSON.stringify({}),
        total: 0,
      },
    },
    status: Status.PENDING,
  },
];

async function main() {
  console.log(`Delete existing data ...`);
  await prisma.order.deleteMany();
  await prisma.userMinimum.deleteMany();
  await prisma.basket.deleteMany();
  console.log(`Existing data deleted.`);

  console.log(`Start seeding ...`);
  for (const o of orders) {
    const order = await prisma.order.create({ data: o });
    console.log(`Created order with id: ${order.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // @ts-ignore
    process.exit(1);
  });
