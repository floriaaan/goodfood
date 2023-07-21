import { Product, ProductId } from "@product/types/Product";
import { Data } from "@product/types";
import { prisma } from "@product/lib/prisma";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const ReadProduct = async (
	{ request }: Data<ProductId>,
	callback: (err: ServerErrorResponse | null, response: Product | null) => void
) => {
	try {
		const { id } = request;

		const product = await prisma.product.findFirstOrThrow({ where : {id} }) as unknown as Product;

		callback(null, product);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};