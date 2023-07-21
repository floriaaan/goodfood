import { Promotion } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";
import prisma from "@promotions/lib/prisma";

export const UpdatePromotion = async (
	{ request }: Data<Promotion>,
	callback: (err: any, response: Promotion | null) => void
) => {
	try {
		const { id, code, method, reduction } = request;

		const promotion = await prisma.promotion.update({
			where: { id },
			data: {
			code,
			method,
			reduction,
			},
		});
		
		callback(null, promotion);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};