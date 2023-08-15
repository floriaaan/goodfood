import {userRoutes} from "@gateway/controller/user/user.controller";
import {orderRoutes} from "@gateway/controller/order/order.controller";
import {productRoutes} from "@gateway/controller/product/product.controller";
import {categoryRoutes} from "@gateway/controller/product/category.controller";
import {allergenRoutes} from "@gateway/controller/product/allergen.controller";
import {deliveryRoutes} from "@gateway/controller/delivery/delivery.controller";
import {deliveryPersonRoutes} from "@gateway/controller/delivery/deliveryPerson.controller";
import {promotionRoutes} from "@gateway/controller/promotion/promotion.controller";
import {stockPersonRoutes} from "@gateway/controller/stock/stockPerson.controller";
import {stockRoutes} from "@gateway/controller/stock/stock.controller";
import {logRoutes} from "@gateway/controller/log/log.controller";
import {metricRoutes} from "@gateway/controller/metric/metric.controller";
import {basketRoutes} from "@gateway/controller/basket/basket.controller";
import {log, utils} from "@gateway/lib/log/log";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.GATEWAY_PORT || 50000;

app.use('/', userRoutes
// #swagger.tags = ['User']
);
app.use('/', basketRoutes
// #swagger.tags = ['Basket']
);
app.use('/', orderRoutes
// #swagger.tags = ['Order']
);
app.use('/', categoryRoutes
// #swagger.tags = ['Category']
);
app.use('/', allergenRoutes
// #swagger.tags = ['Allergen']
);
app.use('/', productRoutes
// #swagger.tags = ['Product']
);
app.use('/', deliveryRoutes
// #swagger.tags = ['Delivery']
);
app.use('/', deliveryPersonRoutes
// #swagger.tags = ['DeliveryPerson']
);
app.use('/', logRoutes
// #swagger.tags = ['Log']
);
app.use('/', metricRoutes
// #swagger.tags = ['Metric']
);
app.use('/', promotionRoutes
// #swagger.tags = ['Promotion']
);
app.use('/', stockRoutes
// #swagger.tags = ['Stock']
);
app.use('/', stockPersonRoutes
// #swagger.tags = ['StockPerson']
);

app.listen(PORT, () => {
    const message = `---- ${utils.green("good")}${utils.yellow(
        "food"
    )} Gateway ----\nstarted on: ${utils.bold(`0.0.0.0:${PORT}`)} ${utils.green(
        "✓"
    )}\n`;
    log.debug(message);
});