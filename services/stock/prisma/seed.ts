import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const ingredients_restaurant: Prisma.IngredientRestaurantCreateInput[] = [];

async function main() {
  console.log(`Delete existing data ...`);
  await prisma.ingredient.deleteMany();
  await prisma.ingredientRestaurant.deleteMany();
  await prisma.supplier.deleteMany();
  console.log(`Existing data deleted.`);

  console.log(`Start seeding ...`);
  for (const i_r of ingredients_restaurant) {
    const i_r_in_db = await prisma.ingredientRestaurant.create({ data: i_r });
    console.log(`Created ingredient_restaurant with id: ${i_r_in_db.id}`);
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
