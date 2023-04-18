import { AllergenId } from "../../types/Allergen";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const ReadAllergen = async (
	data: Data<AllergenId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ReadAllergen handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		const allergen = await prisma.allergen.findFirstOrThrow({ where : {id} });

		callback(null, allergen);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};