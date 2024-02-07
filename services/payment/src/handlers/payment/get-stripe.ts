import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import {
  GetPaymentsByStripeRequest,
  GetPaymentsByStripeResponse,
} from "@payment/types/payment";
import { Data } from "@payment/types";

export const GetPaymentsByStripe = async (
  { request }: Data<GetPaymentsByStripeRequest>,
  callback: (err: any, response: GetPaymentsByStripeResponse | null) => void
) => {
  try {
    const { id } = request;
    const payments = await prisma.payment.findMany({
      where: { stripe_id: id },
      include: { user: true },
    });
    callback(null, {
      payments: payments.map((payment) => ({
        ...payment,
        created_at: payment.created_at.toISOString(),
        updated_at: payment.updated_at.toISOString(),
      })),
    });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
