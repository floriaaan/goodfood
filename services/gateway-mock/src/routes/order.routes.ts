import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Order, Status } from "@mock/types";

export const orderRoutes = Router();

orderRoutes.post("/api/order", (req: Request, res: Response) => {
  const order: Order = {
    id: `order-${db.orders.length + 1}`,
    status: Status.PENDING,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...req.body,
  };
  db.orders.push(order);
  return res.status(201).json(order);
});

orderRoutes.get("/api/order/by-user/:userId", (req: Request, res: Response) => {
  const list = db.orders.filter((o) => o.userId === req.params.userId);
  return res.status(200).json({ ordersList: list });
});

orderRoutes.get("/api/order/by-delivery-person", (_req: Request, res: Response) => {
  return res.status(200).json({ ordersList: db.orders });
});

orderRoutes.get("/api/order/by-status/:status", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const list = db.orders.filter((o) => String(o.status) === req.params.status);
  return res.status(200).json({ ordersList: list });
});

orderRoutes.get("/api/order/by-restaurant/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const list = db.orders.filter((o) => o.restaurantId === req.params.id);
  return res.status(200).json({ ordersList: list });
});

orderRoutes.get("/api/order/by-delivery/:deliveryId", (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.deliveryId === req.params.deliveryId);
  if (!order) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(order);
});

orderRoutes.get("/api/order/by-payment/:paymentId", (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.paymentId === req.params.paymentId);
  if (!order) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(order);
});

orderRoutes.put("/api/order/claim/:id", (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.status = Status.IN_PROGRESS;
  return res.status(200).json(order);
});

orderRoutes.put("/api/order/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  Object.assign(order, req.body, { updated_at: new Date().toISOString() });
  return res.status(200).json(order);
});

orderRoutes.delete("/api/order/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.orders.splice(index, 1);
  return res.status(200).json(removed);
});

orderRoutes.get("/api/order/:id", (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(order);
});
