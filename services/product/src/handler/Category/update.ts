import { Category } from "../../types/Category"; 
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const UpdateCategory = async (
	data: Data<Category>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at UpdateCategory handler\n", data.request);
	try {
        const { id, libelle, hexa_color, icon, products } = data.request;

		const category = await prisma.category.update({ 
            where : { id },
            data: {
                libelle,
				icon,
				hexa_color,
                products: {
                    connect: products
                }
            },
        });

		callback(null, category);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};