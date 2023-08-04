import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { UpdatePaymentRequest, Payment } from "@payment/types/payment";
import { Data } from "@payment/types";

export const UpdatePayment = async (
  { request }: Data<UpdatePaymentRequest>,
  callback: (err: any, response: Payment | null) => void
) => {
  try {
    const { id, status } = request;

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: { user: true },
    });
    callback(null, payment);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
