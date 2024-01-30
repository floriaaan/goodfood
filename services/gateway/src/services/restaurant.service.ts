import { Restaurant, RestaurantId } from "@gateway/proto/restaurant_pb";
import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";

export const getRestaurant = (id: string): Promise<Restaurant | undefined> => {
  return new Promise((resolve, reject) => {
    restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
