import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const allergens: Prisma.AllergenCreateInput[] = [
	{
		id: "allergen_id:1",
		libelle: "Arachide"
	},
	{
		id: "allergen_id:2",
		libelle: "Iode"
	},
	{
		id: "allergen_id:3",
		libelle: "Pollen"
	},
	{
		id: "allergen_id:4",
		libelle: "Peanuts"
	},
];


const categories: Prisma.CategoryCreateInput[] = [
	{
		id: "category_id:1",
		libelle: "Végéterien",
		hexa_color: "#dedede",
		icon: "link:1"
	},
	{
		id: "category_id:2",
		libelle: "Épicé",
		hexa_color: "#bbbbbb",
		icon: "link:2"
	},
	{
		id: "category_id:3",
		libelle: "Frais",
		hexa_color: "#ghghgh",
		icon: "link:3"
	},
];

async function main() {
	console.log(`Delete existing data ...`);
	await prisma.product.deleteMany();
	await prisma.allergen.deleteMany();
	await prisma.category.deleteMany();
	console.log(`Existing data deleted.`);

	console.log(`Start seeding ...`);
	for (const a of allergens) {
		const allergen = await prisma.allergen.create({ data: a });
		console.log(`Created product with id: ${allergen.id}`);
	}
	for (const c of categories) {
		const category = await prisma.category.create({ data: c });
		console.log(`Created category with id: ${category.id}`);
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