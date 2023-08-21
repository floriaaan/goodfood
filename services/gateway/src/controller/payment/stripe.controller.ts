import {Request, Response, Router} from "express";
import {CreateCheckoutSessionRequest} from "@gateway/proto/payment_pb";
import {stripeServiceClient} from "@gateway/services/clients/payment.client";

export const stripeRoutes = Router();

stripeRoutes.post('/api/payment/stripe', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: "Id",
                name: "John",
                email: "mail",
                total: 12
            }
    } */
    const {userId, name, email, total} = req.body;
    const createCheckoutSessionRequest = new CreateCheckoutSessionRequest().setUserId(userId).setName(name).setEmail(email).setTotal(total);
    stripeServiceClient.createCheckoutSession(createCheckoutSessionRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});
