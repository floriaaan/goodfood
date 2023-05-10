import { Product } from "@product/types/Product";
import { Data } from "@product/types";
import { prisma } from "@product/lib/prisma";
import { log } from "@product/lib/log";
import { PrismaClient, Product_type } from "@prisma/client";

export const UpdateProduct = async (
	data: Data<Product>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at UpdateProduct handler\n", data.request);
	try {
		const { id, name, image, comment, price, preparation, weight, kilocalories, nutriscore, restaurant_id, type, categories, allergens } = data.request;

		const product = await prisma.product.update({ 
            where : { id },
            data: {
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