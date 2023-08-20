import {Request, Response, Router} from "express";
import {GetPaymentRequest, GetPaymentsByUserRequest} from "@gateway/proto/payment_pb";
import {paymentServiceClient} from "@gateway/services/clients/payment.client";

export const paymentRoutes = Router();

paymentRoutes.get('/api/payment/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    paymentServiceClient.getPayment(new GetPaymentRequest().setId(id), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

paymentRoutes.get('/api/payment/by-user/:userId', (req: Request, res: Response) => {
    const {id} = req.params;

    paymentServiceClient.getPaymentsByUser(new GetPaymentsByUserRequest().setId(id), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});