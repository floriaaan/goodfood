import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { Allergen, AllergenList } from "@product/types/Allergen";
import prisma from "@product/lib/prisma";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const GetAllergenList = async (
	{ request} : Data<null>, 
	callback: (err: ServerErrorResponse | null, response: AllergenList | null) => void
) => {
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
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};