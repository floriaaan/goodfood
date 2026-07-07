import { Request, Response, Router } from "express";

export const healthCheckRoutes = Router();

const services = [
  "basketService",
  "deliveryService",
  "logService",
  "metricService",
  "notificationService",
  "orderService",
  "paymentService",
  "productService",
  "promotionService",
  "restaurantService",
  "stockService",
  "userService",
];

healthCheckRoutes.get("/api/health-check", (_req: Request, res: Response) => {
  const serviceStatuses = Object.fromEntries(services.map((name) => [name, { responseTime: 0, ok: true }]));
  return res.status(200).json(serviceStatuses);
});
