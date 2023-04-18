import { Allergen } from "../../types/Allergen";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const UpdateAllergen = async (
	data: Data<Allergen>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at UpdateAllergen handler\n", data.request);
	try {
        const { id, libelle, products } = data.request;

		const allergen = await prisma.allergen.update({ 
            where : { id },
            data: {
                libelle,
                products: {
                    connect: products
                }
            },
        });

		callback(null, allergen);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};