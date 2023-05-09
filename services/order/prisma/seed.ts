import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();



async function main() {
  console.log(`Start seeding ...`);
  // for (const d of deliveries) {
  //   const delivery = await prisma.delivery.create({
  //     data: d,
  //   });
  //   console.log(`Created delivery with id: ${delivery.id}`);
  // }
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
