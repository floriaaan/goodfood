import { RestaurantId, PromotionList, Promotion } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";
import prisma from "@promotions/lib/prisma";

export const GetPromotionsByRestaurant = async (
	{ request }: Data<RestaurantId>,
	callback: (err: any, response: PromotionList | null) => void
) => {
	try {
		const { id } = request;

		const promotions = await prisma.promotion.findMany({where : { restaurant_id : id }}) as unknown as Promotion[];
		const promotionList = { promotions } as PromotionList;
		
		callback(null, promotionList);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};