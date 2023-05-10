import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { Allergen, AllergenList } from "@product/types/Allergen";
import prisma from "@product/lib/prisma";

export const GetAllergenList = async (
	data: Data<null>, 
	callback: (err: any, response: AllergenList | null) => void
) => {
	log.debug("Request received at GetAllergenList handler\n", data.request);
	try {
		const allergens = await prisma.allergen.findMany() as Allergen[];

		const allergenList = {} as AllergenList;

		allergens.map(allergen => {
			if(allergenList.allergens == null)
				allergenList.allergens = [allergen] as Allergen[];
			else
				allergenList.allergens.push(allergen);
		});


		callback(null, allergenList);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};