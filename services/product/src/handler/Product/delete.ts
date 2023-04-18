import { ProductId } from "../../types/Product";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const DeleteProduct = async (
	data: Data<ProductId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at DeleteProduct handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		await prisma.product.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};