import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { GetPaymentRequest, Payment } from "@payment/types/payment";
import { Data } from "@payment/types";

export const GetPayment = async (
  { request }: Data<GetPaymentRequest>,
  callback: (err: any, response: Payment | null) => void
) => {
  try {
    const { id } = request;
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { id },
      include: { user: true },
    });
    callback(null, payment);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
