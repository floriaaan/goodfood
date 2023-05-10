import { Allergen } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import prisma from "@product/lib/prisma";

export const UpdateAllergen = async (
	data: Data<Allergen>,
	callback: (err: any, response: Allergen | null) => void
) => {
	log.debug("Request received at UpdateAllergen handler\n", data.request);
	try {
        const { id, libelle } = data.request;

		if (!id && id.trim().length <= 0)
			throw(Error("L'id de l'allergen doit avoir une valeur") as ServerErrorResponse)

		if (!libelle && libelle.trim().length <= 0)
			throw(Error("L'allergen doit avoir une valeur") as ServerErrorResponse)
		
		const allergen = await prisma.allergen.update({
			where : { id },
			data: {
				libelle
			},
		}) as Allergen;

		callback(null, allergen);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};