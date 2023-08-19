import { PrismaClient, Prisma, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const payments: Prisma.PaymentCreateInput[] = [
  {
    id: "payment_id:1",
    stripe_id: "stripe_id:1",
    total: 100,
    status: PaymentStatus.PENDING,
    user: {
      connectOrCreate: {
        where: {
          id: "user_id:1",
        },
        create: {
          id: "user_id:1",
          name: "John Doe",
          email: "honj@eod.com",
        },
      },
    },
  },
  {
    id: "payment_id:2",
    stripe_id: "stripe_id:2",
    total: 200,
    status: PaymentStatus.APPROVED,
    user: {
      connectOrCreate: {
        where: {
          id: "user_id:2",
        },
        create: {
          id: "user_id:2",
          name: "Jane Doe",
          email: "janet@doe.com",
        },
      },
    },
  },
  {
    id: "payment_id:3",
    stripe_id: "stripe_id:3",
    total: 5,
    status: PaymentStatus.REJECTED,
    user: {
      connectOrCreate: {
        where: {
          id: "user_id:1",
        },
        create: {
          id: "user_id:1",
          name: "John Doe",
          email: "honj@eod.com",
        },
      },
    },
  },
];

async function main() {
  console.log(`Delete existing data ...`);
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();
  console.log(`Existing data deleted.`);

  console.log(`Start seeding ...`);
  for (const data of payments) {
    const { id } = await prisma.payment.create({ data });
    console.log(`Created payment with id: ${id}`);
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
