import { CategoryId } from "@product/types/Category"; 
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import { Allergen } from "@prisma/client";
import prisma from "@product/lib/prisma";

export const DeleteCategory = async (
	{ request }: Data<CategoryId>,
	callback: (err: ServerErrorResponse | any) => void
) => {
	try {
		const { id } = request;

		if((await prisma.allergen.findFirst({where: {id: id}}) as Allergen | null) == null)
			throw(Error("La catégorie n'existe  pas") as ServerErrorResponse)
		
			await prisma.category.delete({ where : {id} });

		callback(null);
	} catch (error) {
		log.error(error);
		callback(error);
	}
};