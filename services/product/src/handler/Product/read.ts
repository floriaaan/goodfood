import { ProductId } from "../../types/Product";
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const ReadProduct = async (
	data: Data<ProductId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ReadProduct handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		const product = await prisma.product.findFirstOrThrow({ where : {id} });

		callback(null, product);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};