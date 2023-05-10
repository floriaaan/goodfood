import { ProductId } from "@product/types/Product";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { PrismaClient } from "@prisma/client";
import prisma from "@product/lib/prisma";

export const DeleteProduct = async (
	data: Data<ProductId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at DeleteProduct handler\n", data.request);
	try {
		const { id } = data.request;

		await prisma.product.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};