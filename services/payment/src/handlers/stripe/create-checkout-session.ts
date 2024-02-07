import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { Data } from "@payment/types";
import { stripe } from "@payment/lib/stripe";
import {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "@payment/types/stripe";

const FEES_IN_EUR = 0.5;

export const CreateCheckoutSession = async (
  { request }: Data<CreateCheckoutSessionRequest>,
  callback: (err: any, response: CreateCheckoutSessionResponse | null) => void
) => {
  try {
    const { total, user_id, name, email, return_url_base } = request;

    const newPayment = await prisma.payment.create({
      data: {
        stripe_id: (Math.random()+1).toString(36).substring(2),
        total: total + FEES_IN_EUR,
        user: {
          connectOrCreate: {
            where: { id: user_id },
            create: { id: user_id, name, email },
          },
        },
      },
      include: { user: true },
    });

    const { client_secret, id } = await stripe.checkout.sessions.create({
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
      return_url: return_url_base + "/checkout/callback/" + newPayment.id,
      ui_mode: 'embedded',
    });

    const payment = await prisma.payment.update({
      where: {
        id: newPayment.id,
      },
      data: {
        stripe_id: id,
      },
      include: { user: true },
    })

      callback(null, {
        payment,
        clientSecret: client_secret as string,
      });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
