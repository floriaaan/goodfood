import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const deliveryPerson: Prisma.DeliveryPersonCreateInput[] = [
  {
    id: "random_id",
    first_name: "John",
    last_name: "Doe",
    phone: "0612345678",
    location: [4.123, 52.123],
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    phone: "0612345679",
    location: [4.123, 52.124],
  },
  {
    first_name: "Jack",
    last_name: "Doe",
    phone: "0612345677",
    location: [4.124, 52.123],
  },
];

const deliveries: Prisma.DeliveryCreateInput[] = [
  {
    address: "15 rue de la paix 75000 Paris",
    eta: new Date("2023-01-01"),
    delivery_person: { create: deliveryPerson[0] },

    restaurant_id: "restaurant_id:1",
    user_id: "user_id:1",
  },
  {
    address: "15 rue de la paix 75000 Paris",
    eta: new Date("2023-01-01"),
    delivery_person: { create: deliveryPerson[0] },

    restaurant_id: "restaurant_id:2",
    user_id: "user_id:1",
  },
  {
    address: "16 rue de la paix 75000 Paris",
    eta: new Date("2023-02-01"),
    delivery_person: { create: deliveryPerson[1] },

    restaurant_id: "restaurant_id:1",
    user_id: "user_id:2",
  },
  {
    address: "17 rue de la paix 75000 Paris",
    eta: new Date("2023-03-01"),
    delivery_person: { create: deliveryPerson[2] },

    restaurant_id: "restaurant_id:1",
    user_id: "user_id:3",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const d of deliveries) {
    const delivery = await prisma.delivery.create({
      data: d,
    });
    console.log(`Created delivery with id: ${delivery.id}`);
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
