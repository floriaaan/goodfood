import { ProductId } from "@product/types/Product";
import { Data } from "@product/types";
import { prisma } from "@product/lib/prisma";
import { log } from "@product/lib/log";
import { PrismaClient } from "@prisma/client";

export const ReadProduct = async (
	data: Data<ProductId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ReadProduct handler\n", data.request);
	try {
		const { id } = data.request;

		const product = await prisma.product.findFirstOrThrow({ where : {id} });

		callback(null, product);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};