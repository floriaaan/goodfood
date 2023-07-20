import { PromotionCreateInput } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";

export const CreatePromotion = async (
        { request }: Data<PromotionCreateInput>,
        callback: (err: any, response: any) => void
    ) => {
        try {
            callback(null, null);
        } catch (error) {
            log.error(error);
            callback(error, null);
    }
};