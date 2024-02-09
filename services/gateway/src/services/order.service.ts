import orderClient from "@gateway/services/clients/order.client";
import { Basket as BasketSnapshot, CreateOrderRequest, Order, UserMinimum } from "@gateway/proto/order_pb";
import { User } from "@gateway/proto/user_pb";
import { Basket } from "@gateway/proto/basket_pb";

export const createOrder = (
  paymentId: string,
  deliveryId: string,
  type: string,
  user: User,
  basket: Basket,
  restaurantId: string,
): Promise<Order | undefined> => {
  return new Promise((resolve, reject) => {
    orderClient.createOrder(
      new CreateOrderRequest()
        .setPaymentId(paymentId)
        .setDeliveryId(deliveryId)
        .setDeliveryType(type)
        .setUser(
          new UserMinimum()
            .setId(user.getId())
            .setEmail(user.getEmail())
            .setPhone(user.getPhone())
            .setFirstName(user.getFirstName())
            .setLastName(user.getLastName()),
        )
        .setBasketSnapshot(new BasketSnapshot().setString(JSON.stringify(basket.toObject())))
        .setRestaurantId(restaurantId),
      (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
};
