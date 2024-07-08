import { basketRoutes } from "@gateway/controller/basket/basket.controller";
import { deliveryRoutes } from "@gateway/controller/delivery/delivery.controller";
import { deliveryPersonRoutes } from "@gateway/controller/delivery/deliveryPerson.controller";
import { logRoutes } from "@gateway/controller/log/log.controller";
import { metricRoutes } from "@gateway/controller/metric/metric.controller";
import { notificationRoutes } from "@gateway/controller/notification/notification.controller";
import { orderRoutes } from "@gateway/controller/order/order.controller";
import { paymentRoutes } from "@gateway/controller/payment/payment.controller";
import { stripeRoutes } from "@gateway/controller/payment/stripe.controller";
import { allergenRoutes } from "@gateway/controller/product/allergen.controller";
import { categoryRoutes } from "@gateway/controller/product/category.controller";
import { productRoutes } from "@gateway/controller/product/product.controller";
import { promotionRoutes } from "@gateway/controller/promotion/promotion.controller";
import { restaurantRoutes } from "@gateway/controller/restaurant/restaurant.controller";
import { stockRoutes } from "@gateway/controller/stock/stock.controller";
import { stockPersonRoutes } from "@gateway/controller/stock/stockPerson.controller";
import { mainAddressRoutes } from "@gateway/controller/user/mainAddress.controller";
import { userRoutes } from "@gateway/controller/user/user.controller";
import { log, utils } from "@gateway/lib/log/log";
import swaggerUi from "swagger-ui-express";

import { health_checkRoutes } from "@gateway/handlers/health-check";

import { stripe_webhook_listener } from "@gateway/webhook";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { withCheck } from "@gateway/middleware/auth";

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

const PORT = process.env.GATEWAY_PORT || 50000;

app.use(
  "/",
  userRoutes,
  // #swagger.tags = ['User']
);
app.use(
  "/",
  mainAddressRoutes,
  // #swagger.tags = ['User']
);
app.use(
  "/",
  basketRoutes,
  // #swagger.tags = ['Basket']
);
app.use(
  "/",
  paymentRoutes,
  // #swagger.tags = ['Payment']
);
app.use(
  "/",
  stripeRoutes,
  // #swagger.tags = ['Payment']
);
app.use(
  "/",
  orderRoutes,
  // #swagger.tags = ['Order']
);
app.use(
  "/",
  productRoutes,
  // #swagger.tags = ['Product']
);
app.use(
  "/",
  categoryRoutes,
  // #swagger.tags = ['Product']
);
app.use(
  "/",
  allergenRoutes,
  // #swagger.tags = ['Product']
);
app.use(
  "/",
  restaurantRoutes,
  // #swagger.tags = ['Restaurant']
);
app.use(
  "/",
  deliveryRoutes,
  // #swagger.tags = ['Delivery']
);
app.use(
  "/",
  deliveryPersonRoutes,
  // #swagger.tags = ['Delivery']
);
app.use(
  "/",
  logRoutes,
  // #swagger.tags = ['Log']
);
app.use(
  "/",
  metricRoutes,
  // #swagger.tags = ['Metric']
);
app.use(
  "/",
  promotionRoutes,
  // #swagger.tags = ['Promotion']
);
app.use(
  "/",
  stockRoutes,
  // #swagger.tags = ['Stock']
);
app.use(
  "/",
  stockPersonRoutes,
  // #swagger.tags = ['Stock']
);
app.use(
  "/",
  notificationRoutes,
  // #swagger.tags = ['Notification']
);

app.use(
  "/",
  health_checkRoutes,
  // #swagger.tags = ['Health Check']
);

app.use("/docs", (__req, res) => {
  return res.send(require("./lib/swagger/swagger-output.json"));
});

app.listen(PORT, () => {
  const message = `---- ${utils.green("good")}${utils.yellow("food")} Gateway ----\nstarted on: ${utils.bold(
    `0.0.0.0:${PORT}`,
  )} ${utils.green("✓")}\n`;
  log.debug(message);
  stripe_webhook_listener();
});
