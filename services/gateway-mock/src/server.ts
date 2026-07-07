import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { allergenRoutes, categoryRoutes, productRoutes } from "@mock/routes/product.routes";
import { basketRoutes } from "@mock/routes/basket.routes";
import { deliveryPersonRoutes, deliveryRoutes } from "@mock/routes/delivery.routes";
import { healthCheckRoutes } from "@mock/routes/health.routes";
import { logRoutes } from "@mock/routes/log.routes";
import { metricRoutes } from "@mock/routes/metric.routes";
import { notificationRoutes } from "@mock/routes/notification.routes";
import { orderRoutes } from "@mock/routes/order.routes";
import { paymentRoutes, stripeRoutes } from "@mock/routes/payment.routes";
import { promotionRoutes } from "@mock/routes/promotion.routes";
import { restaurantRoutes } from "@mock/routes/restaurant.routes";
import { stockPersonRoutes, stockRoutes } from "@mock/routes/stock.routes";
import { mainAddressRoutes, userRoutes } from "@mock/routes/user.routes";

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const PORT = process.env.GATEWAY_PORT || 50000;

app.use("/", userRoutes);
app.use("/", mainAddressRoutes);
app.use("/", basketRoutes);
app.use("/", paymentRoutes);
app.use("/", stripeRoutes);
app.use("/", orderRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", allergenRoutes);
app.use("/", restaurantRoutes);
app.use("/", deliveryRoutes);
app.use("/", deliveryPersonRoutes);
app.use("/", logRoutes);
app.use("/", metricRoutes);
app.use("/", promotionRoutes);
app.use("/", stockRoutes);
app.use("/", stockPersonRoutes);
app.use("/", notificationRoutes);
app.use("/", healthCheckRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`---- goodfood Gateway MOCK ----\nstarted on: 0.0.0.0:${PORT}\n`);
});
