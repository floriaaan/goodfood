import { RestaurantId } from "@product/types/Product";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import prisma from "@product/lib/prisma";

export const ListProduct = async (
	data: Data<RestaurantId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ListProduct handler\n", data.request);
	try {
		const { id } = data.request;

		const products = await prisma.product.findMany({ where : {restaurant_id: id} });

		callback(null, { products });
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};