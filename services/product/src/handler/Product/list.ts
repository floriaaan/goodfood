import { ProductList, RestaurantId } from "@product/types/Product";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import prisma from "@product/lib/prisma";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const ListProduct = async (
	{ request }: Data<RestaurantId>,
	callback: (err: ServerErrorResponse | any, response: ProductList | null) => void
) => {
	try {
		const { id } = request;

		const products = await prisma.product.findMany({ where : {restaurant_id: id} }) as unknown as ProductList;

		callback(null, products);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};