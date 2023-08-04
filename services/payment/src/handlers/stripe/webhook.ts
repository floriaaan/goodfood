import { log, utils } from "@payment/lib/log";
import prisma from "@payment/lib/prisma";
import { STRIPE_ENDPOINT_SECRET, stripe } from "@payment/lib/stripe";
import { PaymentStatus } from "@prisma/client";
import express from "express";

const app = express();

const STRIPE_WEBHOOK_ENDPOINT =
  process.env.STRIPE_WEBHOOK_ENDPOINT || "/webhook";

app.post(
  STRIPE_WEBHOOK_ENDPOINT,
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (STRIPE_ENDPOINT_SECRET) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"] as string;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          STRIPE_ENDPOINT_SECRET
        );
      } catch (err) {
        log.error(err);
        return response.status(400).send((err as Error).message);
      }
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const { payment_status, id } = event.data.object;

        if (payment_status === "paid")
          await prisma.payment.update({
            where: { stripe_id: id },
            data: { status: PaymentStatus.APPROVED },
          });
        break;
      }

      // case checkout session expired
      case "checkout.session.expired": {
        const { payment_status, id } = event.data.object;
        if (payment_status === "unpaid")
          await prisma.payment.update({
            where: { stripe_id: id },
            data: { status: PaymentStatus.REJECTED },
          });
        break;
      }

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

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
      `${utils.bold(
        utils.magenta("stripe webhook")
      )} started on port: ${utils.bold(ADDRESS)} ${utils.green("✓")}\n`
    );
  });
  return app;
}
