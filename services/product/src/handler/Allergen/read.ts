import { Allergen, AllergenId } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import prisma from "@product/lib/prisma";

export const ReadAllergen = async (
	data: Data<AllergenId>,
	callback: (err: any, response: Allergen | null) => void
) => {
	log.debug("Request received at ReadAllergen handler\n", data.request);
	try {
		const { id } = data.request;

		if (!id && id.trim().length <= 0)
			throw(Error("L'id de l'allergen doit avoir une valeur") as ServerErrorResponse)

		const allergen = await prisma.allergen.findFirstOrThrow({ where : {id} }) as Allergen;

		callback(null, allergen);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};