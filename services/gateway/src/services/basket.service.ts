import { basketServiceClient } from "@gateway/services/clients/basket.client";
import { Basket, UserIdRequest } from "@gateway/proto/basket_pb";

export const getBasketByUser = (id: string): Promise<Basket | undefined> => {
  const userId = new UserIdRequest().setUserId(id);
  return new Promise((resolve, reject) => {
    basketServiceClient.getBasket(userId, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

export const resetBasketByUser = (id: string): Promise<Basket | undefined> => {
  const userId = new UserIdRequest().setUserId(id);
  return new Promise((resolve, reject) =>
    basketServiceClient.reset(userId, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    }),
  );
};
