import { ProductId } from "@product/types/Product";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { PrismaClient } from "@prisma/client";
import prisma from "@product/lib/prisma";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const DeleteProduct = async (
	{ request }: Data<ProductId>,
	callback: (err: ServerErrorResponse | any, response: null) => void
) => {
	try {
		const { id } = request;

		await prisma.product.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};