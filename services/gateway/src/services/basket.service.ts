import {basketServiceClient} from "@gateway/services/clients/basket.client";
import {Basket, UserId} from "@gateway/proto/basket_pb";

export const getBasketByUser = (id: string): Basket | undefined => {
    const userId = new UserId();
    userId.setId(Number(id));
    let basket: Basket | undefined = undefined;
    basketServiceClient.getBasket(userId, (error, response) => {
        if (error) {
            throw Error(error.message);
        } else {
            basket = response
        }
    });
    return basket;
}