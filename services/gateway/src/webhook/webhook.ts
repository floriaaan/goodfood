import { stripe, STRIPE_ENDPOINT_SECRET } from "@gateway/lib/stripe";
import { log, utils } from "@gateway/lib/log/log";
import express from "express";
import { paymentServiceClient } from "@gateway/services/clients/payment.client";
import { Payment, UpdatePaymentStatusRequest } from "@gateway/proto/payment_pb";
import { PaymentStatus } from "@gateway/webhook/PaymentStatus";
import orderClient from "@gateway/services/clients/order.client";
import { Basket, CreateOrderRequest, UserMinimum } from "@gateway/proto/order_pb";
import { getBasketByUser, resetBasketByUser } from "@gateway/services/basket.service";
import { getUser } from "@gateway/services/user.service";
import { createDelivery } from "@gateway/services/delivery.service";
import { getRestaurant } from "@gateway/services/restaurant.service";
import { Address } from "@gateway/proto/delivery_pb";
import { updateQuantityFromBasket } from "@gateway/services/stock.service";

const app = express();

const STRIPE_WEBHOOK_ENDPOINT = process.env.STRIPE_WEBHOOK_ENDPOINT || "/webhook";

app.post(STRIPE_WEBHOOK_ENDPOINT, express.raw({ type: "application/json" }), async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (STRIPE_ENDPOINT_SECRET) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"] as string;
    try {
      event = stripe.webhooks.constructEvent(request.body, signature, STRIPE_ENDPOINT_SECRET);
    } catch (err) {
      log.error(err);
      return response.status(400).send((err as Error).message);
    }
  }

  const { payment_status, id } = event.data.object;
  let payment: Payment.AsObject;
  paymentServiceClient.updatePaymentStatus(
    new UpdatePaymentStatusRequest().setId(id).setStatus(payment_status as PaymentStatus),
    (error, response) => {
      if (error) log.error("Gateway-webhook: UpdatePaymentStatusRequest: ", error);
      else payment = response.toObject();
    },
  );

  switch (event.type) {
    case "checkout.session.completed": {
      // @ts-ignore
      if (!payment) break;
      const basket = await getBasketByUser(payment.user!.id);
      if (!basket) break;

      const restaurant = await getRestaurant(basket.getRestaurantId());
      if (!restaurant) break;

      const user = await getUser(payment.user!.id);
      if (!user) break;

      const mainAddress = user.getMainaddress();
      if (!mainAddress) break;

      const delivery = await createDelivery(
        new Address().setLat(mainAddress.getLat()).setLng(mainAddress.getLng()),
        user.getId(),
        restaurant.getId(),
      );
      if (!delivery) break;
      // GetIngredientRestaurantsByProduct (ING service) -> get ingredient quantity by productId in (product service) -> delete ingredient quantity in (ingredient service)

      basket.getProductsList().map(async (product) => {
        updateQuantityFromBasket(product.getId());
      });

      // TODO: Set delivery Type
      orderClient.createOrder(
        new CreateOrderRequest()
          .setPaymentId(payment.id)
          .setDeliveryId(delivery.getId())
          .setDeliveryType("delivery")
          .setUser(new UserMinimum().setId(user.getId()).setEmail(user.getEmail()).setPhone(user.getPhone()))
          .setBasketSnapshot(new Basket().setString(basket?.toString() || ""))
          .setRestaurantId(basket?.getRestaurantId()),
        (error, response) => {
          if (error) log.error("Gateway-webhook: createOrder: ", error);
          else resetBasketByUser(user.getId());
        },
      );

      if (payment_status === "paid") break;
    }

    // case checkout session expired
    case "checkout.session.expired": {
      if (payment_status === "unpaid") break;
    }

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

const PORT = Number(process.env.STRIPE_WEBHOOK_PORT) || 4242;
const ADDRESS = `0.0.0.0:${PORT}${STRIPE_WEBHOOK_ENDPOINT}`;

/**
 * Starts a Stripe webhook listener.
 *
 * TODO: implement TLS for production.
 *
 * @remarks This function starts an HTTP server using the `app` instance and listens on the specified `PORT`.
 * @returns The express `app` instance.
 */
export default function stripe_webhook_listener() {
  app.listen(PORT, () => {
    log.debug(
      `${utils.bold(utils.magenta("stripe webhook"))} started on port: ${utils.bold(ADDRESS)} ${utils.green("✓")}\n`,
    );
  });
  return app;
}
