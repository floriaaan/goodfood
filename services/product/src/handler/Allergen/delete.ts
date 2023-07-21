import { Allergen, AllergenId } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import prisma from "@product/lib/prisma";

export const DeleteAllergen = async (
	{ request} : Data<AllergenId>,
	callback: (err: ServerErrorResponse | null) => void
) => {
	try {
		const { id } = request;

		if((await prisma.allergen.findFirst({where: {id: id}}) as Allergen | null) == null)
			throw(Error("L'allergen n'existe  pas") as ServerErrorResponse)

		await prisma.allergen.delete({ where : {id} });

		callback(null);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error);
	}
};