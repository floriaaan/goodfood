import { Request, Response, Router } from "express";
import { GetPaymentRequest, GetPaymentsByUserRequest, Payment } from "@gateway/proto/payment_pb";
import { paymentServiceClient } from "@gateway/services/clients/payment.client";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { check } from "@gateway/middleware/auth";

export const paymentRoutes = Router();

paymentRoutes.get("/api/payment/:id", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------
  const { id } = req.params;

  try {
    const payment: Payment.AsObject = await new Promise((resolve, reject) => {
      paymentServiceClient.getPayment(new GetPaymentRequest().setId(id), (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    });

    if (payment.userId !== userId.toString() || (await check(token, { role: "ADMIN" })))
      return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

paymentRoutes.get("/api/payment/by-user/:userId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['userId'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------
  const { id } = req.params;
  if (!(await check(token, { role: "ADMIN" })) || !(await check(token, { id: id })))
    return res.status(401).json({ message: "Unauthorized" });

  paymentServiceClient.getPaymentsByUser(new GetPaymentsByUserRequest().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
