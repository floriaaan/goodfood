import { Product } from "../../types/Product";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";
import { Product_type } from "@prisma/client";

export const CreateProduct = async (
	data: Data<Product>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at CreateProduct handler\n", data.request);
	try {
		const { id, name, image, comment, price, preparation, weight, kilocalories, nutriscore, restaurant_id, type, categories, allergens } = data.request;

		const product = await prisma.product.create({
			data: {
				id,
				name,
				image, 
				comment, 
				price, 
				preparation, 
				weight, 
				kilocalories, 
				nutriscore, 
				restaurant_id, 
				type: type as unknown as Product_type,
				categories: {
					connect: categories
				}, 
				allergens: {
					connect: allergens
				}
			},
		});

		callback(null, product);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};