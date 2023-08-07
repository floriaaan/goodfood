import { Interval } from "@stock/types";

export type GetOutcomesByRestaurantRequest = {
    restaurant_id: string;
    date?: string;
    interval: Interval
}

export type GetOutcomesByRestaurantResponse = {
    value: number;
}