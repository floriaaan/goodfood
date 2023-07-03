import { Allergen } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import prisma from "@product/lib/prisma";

export const UpdateAllergen = async (
	{ request }: Data<Allergen>,
	callback: (err: ServerErrorResponse | any, response: Allergen | null) => void
) => {
	try {
        const { id, libelle } = request;

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
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};