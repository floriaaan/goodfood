import { paymentServiceClient } from "@gateway/services/clients";
import { Payment, UpdatePaymentStatusRequest } from "@gateway/proto/payment_pb";
import { PaymentStatus } from "@gateway/webhook/PaymentStatus";

export const updatePaymentStatus = (id: string, status: PaymentStatus): Promise<Payment | undefined> => {
  return new Promise((resolve, reject) => {
    paymentServiceClient.updatePaymentStatus(
      new UpdatePaymentStatusRequest().setId(id).setStatus(status),
      (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
};
