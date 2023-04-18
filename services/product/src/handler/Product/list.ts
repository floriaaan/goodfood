import { RestaurantId } from "../../types/Product";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const ListProduct = async (
	data: Data<RestaurantId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ListProduct handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		const products = await prisma.product.findMany({ where : {restaurant_id: id} });

		callback(null, { products });
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};