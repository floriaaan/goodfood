import { PromotionId } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";
import prisma from "@promotions/lib/prisma";

export const DeletePromotion = async (
	{ request }: Data<PromotionId>,
	callback: (err: any, response: null) => void
) => {
	try {
		const { id } = request;

		await prisma.promotion.delete({ where : { id } });
		
		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};