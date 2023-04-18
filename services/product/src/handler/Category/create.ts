import { Category } from "../../types/Category"; 
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const CreateCategory = async (
	data: Data<Category>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at CreateCategory handler\n", data.request);
	try {
		const { libelle, hexa_color, icon, products } = data.request;

		const category = await prisma.category.create({
			data: {
				libelle,
				icon,
				hexa_color,
				products: {
					connect: products
				},				
			},
		});

		callback(null, category);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};