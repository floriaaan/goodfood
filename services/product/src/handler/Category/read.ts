import { CategoryId } from "../../types/Category"; 
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const ReadCategory = async (
	data: Data<CategoryId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ReadCategory handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		const category = await prisma.category.findFirstOrThrow({ where : {id} });

		callback(null, category);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};