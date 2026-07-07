import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { Payment, PaymentStatus } from "@mock/types";

export const paymentRoutes = Router();

paymentRoutes.get("/api/payment/by-user/:id", (req: Request, res: Response) => {
  const list = db.payments.filter((p) => p.user_id === req.params.id);
  return res.status(200).json({ paymentsList: list });
});

paymentRoutes.get("/api/payment/:id", (req: Request, res: Response) => {
  const payment = db.payments.find((p) => p.id === req.params.id);
  if (!payment) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(payment);
});

export const stripeRoutes = Router();

stripeRoutes.post("/api/payment/stripe", (req: Request, res: Response) => {
  const payment: Payment = {
    id: `payment-${db.payments.length + 1}`,
    stripe_id: `pi_mock_${Date.now()}`,
    total: Number(req.body.total ?? 0),
    status: PaymentStatus.APPROVED,
    user_id: req.body.user_id ?? req.body.userId ?? "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.payments.push(payment);
  return res.status(201).json(payment);
});

stripeRoutes.post("/api/payment/stripe/create-intent", (req: Request, res: Response) => {
  return res.status(200).json({
    id: `pi_mock_${Date.now()}`,
    client_secret: `pi_mock_${Date.now()}_secret_mock`,
    amount: req.body.total ?? 0,
    currency: "eur",
  });
});
