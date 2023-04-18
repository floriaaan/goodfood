import { Allergen } from "../../types/Allergen";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const CreateAllergen = async (
	data: Data<Allergen>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at CreateAllergen handler\n", data.request);
	try {
		const { libelle, products } = data.request;

		const allergen = await prisma.allergen.create({
			data: {
				libelle,
				products: {
					connect: products
				},				
			},
		});

		callback(null, allergen);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};