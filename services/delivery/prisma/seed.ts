import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const restaurantAddress: Prisma.RestaurantAddressCreateInput[] = [
  {
    id: "restaurant_id:1",
    lat: 41.56,
    lng: 2.12,
    street: "9 rue de la paix",
    city: "Paris",
    country: "France",
    zipcode: "75000",
  },
  {
    id: "restaurant_id:2",
    lat: 41.56,
    lng: 2.12,
    street: "10 rue de la paix",
    city: "Paris",
    country: "France",
    zipcode: "75000",
  },
];

const deliveryPerson: Prisma.DeliveryPersonCreateInput[] = [
  {
    // id: "random_id",
    user_id: "random_id:1",
    first_name: "John",
    last_name: "Doe",
    phone: "0612345678",

    address: {
      create: {
        lat: 41.56,
        lng: 2.12,
        street: "9 rue de la paix",
        city: "Paris",
        country: "France",
        zipcode: "75000",
      },
    },
  },
  {
    user_id: "random_id:2",
    first_name: "Jane",
    last_name: "Doe",
    phone: "0612345679",
    address: {
      create: {
        lat: 41.56,
        lng: 2.12,
        street: "10 rue de la paix",
        city: "Paris",
        country: "France",
        zipcode: "75000",
      },
    },
  },
  {
    user_id: "random_id:3",
    first_name: "Jack",
    last_name: "Doe",
    phone: "0612345677",
    address: {
      create: {
        lat: 41.56,
        lng: 2.12,
        street: "11 rue de la paix",
        city: "Paris",
        country: "France",
        zipcode: "75000",
      },
    },
  },
];

const deliveries: Prisma.DeliveryCreateInput[] = [
  {
    eta: new Date("2023-01-01"),
    delivery_person: {
      connectOrCreate: {
        where: { phone: deliveryPerson[0].phone },
        create: deliveryPerson[0],
      },
    },

    restaurant_address: {
      connectOrCreate: {
        where: { id: restaurantAddress[0].id },
        create: restaurantAddress[0],
      },
    },
    user_id: "user_id:1",
    address: {
      create: {
        lat: 42.56,
        lng: 2.12,
        street: "15 sentier de la paix",
        city: "Saint Denis",
        country: "France",
        zipcode: "75000",
      },
    },
  },
  {
    eta: new Date("2023-01-01"),
    delivery_person: {
      connectOrCreate: {
        where: { phone: deliveryPerson[0].phone },
        create: deliveryPerson[0],
      },
    },

    restaurant_address: {
      connectOrCreate: {
        where: { id: restaurantAddress[1].id },
        create: restaurantAddress[1],
      },
    },
    user_id: "user_id:1",
    address: {
      create: {
        lat: 42.56,
        lng: 2.12,
        street: "15 sentier de la paix",
        city: "Saint Denis",
        country: "France",
        zipcode: "75000",
      },
    },
  },
  {
    eta: new Date("2023-02-01"),
    delivery_person: {
      connectOrCreate: {
        where: { phone: deliveryPerson[1].phone },
        create: deliveryPerson[1],
      },
    },

    restaurant_address: {
      connectOrCreate: {
        where: { id: restaurantAddress[0].id },
        create: restaurantAddress[0],
      },
    },
    user_id: "user_id:2",
    address: {
      create: {
        lat: 42.56,
        lng: 2.12,
        street: "15 sentier de la paix",
        city: "Saint Denis",
        country: "France",
        zipcode: "75000",
      },
    },
  },
  {
    eta: new Date("2023-03-01"),
    delivery_person: {
      connectOrCreate: {
        where: { phone: deliveryPerson[2].phone },
        create: deliveryPerson[2],
      },
    },

    restaurant_address: {
      connectOrCreate: {
        where: { id: restaurantAddress[0].id },
        create: restaurantAddress[0],
      },
    },
    user_id: "user_id:3",
    address: {
      create: {
        lat: 42.56,
        lng: 2.12,
        street: "15 sentier de la paix",
        city: "Saint Denis",
        country: "France",
        zipcode: "75000",
      },
    },
  },
];

async function main() {
  console.log(`Delete existing data ...`);
  await prisma.restaurantAddress.deleteMany();
  await prisma.address.deleteMany();
  await prisma.deliveryPersonAddress.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.deliveryPerson.deleteMany();
  console.log(`Existing data deleted.`);

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
