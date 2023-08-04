import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { Data } from "@payment/types";
import { stripe } from "@payment/lib/stripe";
import {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "@payment/types/stripe";

export const CreateCheckoutSession = async (
  { request }: Data<CreateCheckoutSessionRequest>,
  callback: (err: any, response: CreateCheckoutSessionResponse | null) => void
) => {
  try {
    const { total, user_id, name, email } = request;

    const { url, id } = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Panier - GoodFood",
            },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // todo: change this
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    const payment = await prisma.payment.create({
      data: {
        stripe_id: id,
        total,
        user: {
          connectOrCreate: {
            where: { id: user_id },
            create: { id: user_id, name, email },
          },
        },
      },
      include: { user: true },
    });

    callback(null, {
      payment,
      url: url as string,
    });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
