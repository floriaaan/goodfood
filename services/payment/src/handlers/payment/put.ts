import { prisma } from "@payment/lib/prisma";
import { log } from "@payment/lib/log";
import { Data } from "@payment/types";
import {Payment, UpdatePaymentStatusRequest} from "@payment/types/payment";

export const UpdatePaymentStatus = async (
    { request }: Data<UpdatePaymentStatusRequest>,
    callback: (err: any, response: Payment | null) => void
) => {
    try {
        const { id, status} = request;


        const payment = await prisma.payment.update({
            where: {
                id
            },
            data: {
               status
            },
            include: { user: true },
        });

        callback(null, payment
        );
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
