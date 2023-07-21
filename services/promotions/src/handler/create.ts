import { PromotionCreateInput, Promotion } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";
import prisma from "@promotions/lib/prisma";

export const CreatePromotion = async (
	{ request }: Data<PromotionCreateInput>,
	callback: (err: any, response: Promotion | null) => void
) => {
	try {
		const { code, reduction, method, restaurant_id } = request;

		const promotion = await prisma.promotion.create({
			data: {
				code,
				reduction,
				method,
				restaurant_id
			},
		}) as unknown as Promotion;

		callback(null, promotion);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};