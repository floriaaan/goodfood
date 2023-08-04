import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import {
  GetPaymentsByUserRequest,
  GetPaymentsByUserResponse,
} from "@payment/types/payment";
import { Data } from "@payment/types";

export const GetPaymentsByUser = async (
  { request }: Data<GetPaymentsByUserRequest>,
  callback: (err: any, response: GetPaymentsByUserResponse | null) => void
) => {
  try {
    const { id } = request;
    const payments = await prisma.payment.findMany({
      where: { user_id: id },
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
