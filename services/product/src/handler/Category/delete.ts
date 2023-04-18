import { CategoryId } from "../../types/Category"; 
import { Data } from "../../types";
import { prisma } from "../../lib/prisma";
import { log } from "../../lib/log";

export const DeleteCategory = async (
	data: Data<CategoryId>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at DeleteCategory handler\n", data.request);
	try {
		const { request } = data;
		const { id } = request;

		await prisma.allergen.delete({ where : {id} });

		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};