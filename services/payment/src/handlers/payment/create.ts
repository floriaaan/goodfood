import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { CreatePaymentRequest, Payment } from "@payment/types/payment";
import { Data } from "@payment/types";

export const CreatePayment = async (
  { request }: Data<CreatePaymentRequest>,
  callback: (err: any, response: Payment | null) => void
) => {
  try {
    const { total, user_id, name, email } = request;

    const payment = await prisma.payment.create({
      data: {
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

    callback(null, payment);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
