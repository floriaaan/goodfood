import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { Data } from "@payment/types";
import { stripe } from "@payment/lib/stripe";
import {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse, CreatePaymentIntentRequest, CreatePaymentIntentResponse, SetupIntentResponse,
} from "@payment/types/stripe";


const FEES_IN_EUR = 0.5;

export const CreateCheckoutSession = async (
  { request }: Data<CreateCheckoutSessionRequest>,
  callback: (err: any, response: CreateCheckoutSessionResponse | null) => void
) => {
  try {
    const { total, user_id, name, email, return_url_base } = request;
    const totalWithFees = total + FEES_IN_EUR;
    const newPayment = await prisma.payment.create({
      data: {
        stripe_id: (Math.random()+1).toString(36).substring(2),
        total: totalWithFees,
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
            unit_amount: totalWithFees * 100,
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

export const CreateSetupIntent = async  ({ request }: Data<undefined>,
  callback: (err: any, response: SetupIntentResponse | null) => void
) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-08-01'}
  );
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
  });

  return {
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  };
};


export const CreatePaymentIntent = async  (
  { request }: Data<CreatePaymentIntentRequest>,
  callback: (err: any, response: CreatePaymentIntentResponse | null) => void
) => {

  try {
    const {amount } = request;// Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create({email: request.userMail});
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-04-10'}
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'eur',
      customer: customer.id,
    });

    callback(null, {
      setupIntent: paymentIntent.client_secret ? paymentIntent.client_secret: undefined,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id
    });
  } catch (error) {
    log.error(error);
  }
};