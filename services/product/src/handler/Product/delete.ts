import {ProductId, Recipe} from "@product/types/Product";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import prisma from "@product/lib/prisma";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const DeleteProduct = async (
	{ request }: Data<ProductId>,
	callback: (err: ServerErrorResponse | any, response: null) => void
) => {
	try {
		const { id } = request;

		const recipe = await prisma.recipe.findMany({where: {product_id: id}}) as Recipe[];
	 	recipe.forEach(async (element) => {
			await prisma.recipe.delete({where: {id: element.id}});
		});

		if((await prisma.product.findFirst({where: {id: id}})) == null)
			throw(Error("Le produit n'existe  pas") as ServerErrorResponse)

		await prisma.product.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};