import { Category, CategoryId } from "@product/types/Category"; 
import { Data } from "@product/types";
import { prisma } from "@product/lib/prisma";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const ReadCategory = async (
	data: Data<CategoryId>,
	callback: (err: any, response: Category | null) => void
) => {
	log.debug("Request received at ReadCategory handler\n", data.request);
	try {
		const { id } = data.request;

		if (!id && id.trim().length <= 0)
			throw(Error("L'id de la catégorie doit avoir une valeur") as ServerErrorResponse)

		const category = await prisma.category.findFirstOrThrow({ where : {id} }) as Category;

		callback(null, category);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};