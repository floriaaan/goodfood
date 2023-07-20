import { Promotion } from "@promotions/types/promotion";
import { log } from "@promotions/lib/log";
import { Data } from "@promotions/types";

export const UpdatePromotion = async (
        { request }: Data<Promotion>,
        callback: (err: any, response: Promotion | null) => void
    ) => {
        try {
            callback(null, null);
        } catch (error) {
            log.error(error);
            callback(error, null);
    }
};