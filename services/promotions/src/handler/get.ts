import { PromotionCode, Promotion } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";
import prisma from "@promotions/lib/prisma";

export const GetPromotion = async (
	{ request }: Data<PromotionCode>,
	callback: (err: any, response: Promotion | null) => void
) => {
	try {
		const { code } = request;

		const promotion = await prisma.promotion.findFirstOrThrow({ where: { code } }) as unknown as Promotion;

		callback(null, promotion);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};