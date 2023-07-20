import { Method } from "@prisma/client";

export type Promotion = {
    id: string;

    code: string;
    reduction: string;
    method: Method;
}


export type PromotionCreateInput = {
    code: string;
    reduction: string;
    method: Method;

    restaurant_id: string;
}

export type PromotionId = {
    id: Promotion["id"];
}

export type RestaurantId = {
    id: string;
}

export type PromotionCode = {
    code: Promotion["code"];
}

export type PromotionList = {
    promotions: Promotion[];
}