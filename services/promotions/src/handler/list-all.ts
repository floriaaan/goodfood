import { PromotionId, PromotionList } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";

export const GetPromotions = async (
        { request }: Data<PromotionId>,
        callback: (err: any, response: PromotionList | null) => void
    ) => {
        try {
            callback(null, null);
        } catch (error) {
            log.error(error);
            callback(error, null);
    }
};