import { Request, Response, Router } from "express";
import { CreateCheckoutSessionRequest, CreatePaymentIntentRequest } from "@gateway/proto/payment_pb";
import { stripeServiceClient } from "@gateway/services/clients/payment.client";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { reduceProductFromStock } from "@gateway/lib/payment";

export const stripeRoutes = Router();

// TODO: check if user can modify this payment request
stripeRoutes.post("/api/payment/stripe", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                return_url_base: "http://localhost:3000",
            }
    } 
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await getUser(userId);
  // ----------------------------

  if (!user?.getFirstName() || !user.getLastName() || !user.getEmail())
    return res.status(400).send({ error: "User is missing information" });

  const name = `${user.getFirstName()} ${user.getLastName()}`;
  const email = user.getEmail();
  const total = await reduceProductFromStock(userId.toString());

  const createCheckoutSessionRequest = new CreateCheckoutSessionRequest()
    .setUserId(userId.toString())
    .setName(name)
    .setEmail(email)
    .setTotal(total)
    .setReturnUrlBase(req.body.return_url_base);
  stripeServiceClient.createCheckoutSession(createCheckoutSessionRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

stripeRoutes.post("/api/payment/stripe/create-intent", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await getUser(userId);
  // ----------------------------

  if (!user?.getFirstName() || !user.getLastName() || !user.getEmail())
    return res.status(400).send({ error: "User is missing information" });

  const total = await reduceProductFromStock(userId.toString());
  if (!total || total <= 0) return res.status(400).send({ error: "No products in basket" });

  const createPaymentIntentRequest = new CreatePaymentIntentRequest().setAmount(total).setUsermail(user.getEmail());

  stripeServiceClient.createPaymentIntent(createPaymentIntentRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
