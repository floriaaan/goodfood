import { PromotionCode } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";

export const GetPromotion = async (
        { request }: Data<PromotionCode>,
        callback: (err: any, response: any) => void
    ) => {
        try {
            callback(null, null);
        } catch (error) {
            log.error(error);
            callback(error, null);
    }
};