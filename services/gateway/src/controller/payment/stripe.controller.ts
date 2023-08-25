import { Request, Response, Router } from "express";
import { CreateCheckoutSessionRequest } from "@gateway/proto/payment_pb";
import { stripeServiceClient } from "@gateway/services/clients/payment.client";

export const stripeRoutes = Router();

// TODO: check if user can modify this payment request
stripeRoutes.post("/api/payment/stripe", (req: Request, res: Response) => {
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
  const { userId, name, email, total } = req.body;
  const createCheckoutSessionRequest = new CreateCheckoutSessionRequest()
    .setUserId(userId)
    .setName(name)
    .setEmail(email)
    .setTotal(total);
  stripeServiceClient.createCheckoutSession(createCheckoutSessionRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
