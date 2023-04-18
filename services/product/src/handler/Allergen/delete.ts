import { AllergenId } from "../../types/Allergen";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const DeleteAllergen = async (
	data: Data<AllergenId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at DeleteAllergen handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		await prisma.allergen.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};