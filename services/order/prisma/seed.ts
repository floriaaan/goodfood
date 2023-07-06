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
        json: {
          "product_id:1": { count: 1, price: 15 },
          "product_id:2": { count: 2, price: 10 },
          "product_id:3": { count: 4, price: 15 },
          "product_id:4": { count: 6, price: 15 },
          "product_id:5": { count: 1, price: 15 },
          "product_id:6": { count: 1, price: 15 },
        },
        string: JSON.stringify({
          "product_id:1": { count: 1, price: 15 },
          "product_id:2": { count: 2, price: 10 },
          "product_id:3": { count: 4, price: 15 },
          "product_id:4": { count: 6, price: 15 },
          "product_id:5": { count: 1, price: 15 },
          "product_id:6": { count: 1, price: 15 },
        }),
        total: 35,
      },
    },
    status: Status.PENDING,
    restaurant_id: "restaurant_id:1",
    created_at: new Date("2000-01-01T12:00:00.000Z"),
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
        json: {
          "product_id:1": { count: 1, price: 15 },
          "product_id:3": { count: 4, price: 5 },
        },
        string: JSON.stringify({
          "product_id:1": { count: 1, price: 15 },
          "product_id:3": { count: 4, price: 5 },
        }),
        total: 35,
      },
    },
    status: Status.FULFILLED,
    restaurant_id: "restaurant_id:2",
    created_at: new Date("2000-01-01T12:00:00.000Z"),
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
        json: {
          "product_id:1": { count: 1, price: 15 },
          "product_id:2": { count: 6, price: 15 },
          "product_id:3": { count: 4, price: 15 },
        },
        string: JSON.stringify({
          "product_id:1": { count: 1, price: 15 },
          "product_id:2": { count: 6, price: 15 },
          "product_id:3": { count: 4, price: 15 },
        }),
        total: 15,
      },
    },
    status: Status.PENDING,
    restaurant_id: "restaurant_id:1",
    created_at: new Date("2000-01-01T13:00:00.000Z"),
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
