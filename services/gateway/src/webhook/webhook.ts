import { log, utils } from "@gateway/lib/log/log";
import { stripe, STRIPE_ENDPOINT_SECRET } from "@gateway/lib/stripe";
import { Address } from "@gateway/proto/delivery_pb";
import express from "express";
import { PaymentStatus } from "@gateway/webhook/PaymentStatus";
import { getBasketByUser, resetBasketByUser } from "@gateway/services/basket.service";
import { createDelivery } from "@gateway/services/delivery.service";
import { createOrder } from "@gateway/services/order.service";
import { updatePaymentStatus } from "@gateway/services/payment.service";
import { getRestaurant } from "@gateway/services/restaurant.service";
import { updateQuantityFromBasket } from "@gateway/services/stock.service";
import { getUser } from "@gateway/services/user.service";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const { id } = event.data.object;
      const paymentUpdated = await updatePaymentStatus(id, PaymentStatus.APPROVED);
      if (!paymentUpdated) break;
      const payment = paymentUpdated.toObject();
      try {
        const basket = await getBasketByUser(payment.userId);
        if (!basket) break;
        console.log("basket ", basket);
        const restaurant = await getRestaurant(basket.getRestaurantId());
        if (!restaurant) break;
        console.log("restaurant ", restaurant);
        const user = await getUser(payment.userId);
        if (!user) break;
        console.log("user", user);
        const mainAddress = user.getMainaddress()?.toObject();
        if (!mainAddress) break;
        console.log("mainAddress", mainAddress);

        const restAddress = restaurant.getAddress();
        if (!restAddress) break;
        console.log("restAddress", restAddress);
        const delivery = await createDelivery(
          new Address()
            .setLat(mainAddress.lat)
            .setLng(mainAddress.lng)
            .setCountry(mainAddress.country)
            .setStreet(mainAddress.street)
            .setZipcode(mainAddress.zipcode),
          user.getId(),
          restaurant.getId(),
          restAddress,
        );
        if (!delivery) break;
        console.log("delivery", delivery);

        basket.getProductsList().map(async (product) => {
          await updateQuantityFromBasket(product.getId(), product.getQuantity());
        });
        // TODO: Set delivery Type
        const order = await createOrder(payment.id, delivery.getId(), "DELIVERY", user, basket, restaurant.getId());
        if (order) await resetBasketByUser(user.getId());
      } catch (e) {
        console.log(e);
      }
      // if (payment_status === "paid") break;
      break;
    }

    // case checkout session expired
    case "checkout.session.expired": {
      // if (payment_status === "unpaid") break;
      break;
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
