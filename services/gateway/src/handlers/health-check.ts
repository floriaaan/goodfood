import {
  basketServiceClient,
  deliveryServiceClient,
  logServiceClient,
  metricServiceClient,
  notificationServiceClient,
  orderServiceClient,
  paymentServiceClient,
  productServiceClient,
  promotionServiceClient,
  restaurantServiceClient,
  stockServiceClient,
  userServiceClient,
} from "@gateway/services/clients";
import { Router } from "express";

export const health_checkRoutes = Router();

const services = {
  basketService: basketServiceClient,
  deliveryService: deliveryServiceClient,
  logService: logServiceClient,
  metricService: metricServiceClient,
  notificationService: notificationServiceClient,
  orderService: orderServiceClient,
  paymentService: paymentServiceClient,
  productService: productServiceClient,
  promotionService: promotionServiceClient,
  restaurantService: restaurantServiceClient,
  stockService: stockServiceClient,
  userService: userServiceClient,
};

health_checkRoutes.get("/api/health-check", async (req, res) => {
  const serviceStatuses: Record<
    string,
    {
      responseTime: number;
      ok: boolean;
    }
  > = {};

  for (const [serviceName, serviceClient] of Object.entries(services)) {
    const start = Date.now();
    const deadline = new Date();
    // TODO: Make this configurable
    deadline.setSeconds(deadline.getSeconds() + 5);

    try {
      await new Promise<void>((resolve, reject) => {
        serviceClient.waitForReady(deadline, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const responseTime = Date.now() - start;
      serviceStatuses[serviceName] = { responseTime, ok: true };
    } catch (err) {
      const responseTime = Date.now() - start;
      serviceStatuses[serviceName] = { responseTime, ok: false };
    }
  }

  return res.status(200).json(serviceStatuses);
});
