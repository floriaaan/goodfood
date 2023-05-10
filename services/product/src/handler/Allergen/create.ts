import { Allergen } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import { prisma } from "@product/lib/prisma";

export const CreateAllergen = async (
	data: Data<Allergen>,
	callback: (err: ServerErrorResponse | null, response: Allergen | null) => void
) => {
	log.debug("Request received at CreateAllergen handler\n", data.request);
	try {
		const { libelle } = data.request;

		if (!libelle && libelle.trim().length <= 0)
			throw(Error("L'allergen doit avoir une valeur") as ServerErrorResponse)

		if((await prisma.allergen.findMany({where: {libelle: libelle}}) as Allergen[] | null) == null)
			throw(Error("L'allergen existe déjà") as ServerErrorResponse)

		const allergen = await prisma.allergen.create({
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