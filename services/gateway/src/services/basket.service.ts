import {basketServiceClient} from "@gateway/services/clients/basket.client";
import {Basket, UserId} from "@gateway/proto/basket_pb";

export const getBasketByUser = (id: string): Promise<Basket | undefined> => {
    const userId = new UserId();
    userId.setId(Number(id));
    return new Promise((resolve, reject) => {
        basketServiceClient.getBasket(userId, (error, response) => {
            if (error) {
              reject(error);
            } else {
                resolve(response)
            }
        });
    })
}
