import {userRoutes} from "@gateway/controller/user/user.controller";
import {orderRoutes} from "@gateway/controller/order/order.controller";
import {productRoutes} from "@gateway/controller/product/product.controller";
import {categoryRoutes} from "@gateway/controller/product/category.controller";
import {allergenRoutes} from "@gateway/controller/product/allergen.controller";
import {deliveryRoutes} from "@gateway/controller/delivery/delivery.controller";
import {deliveryPersonRoutes} from "@gateway/controller/delivery/deliveryPerson.controller";
import {promotionsRoutes} from "@gateway/controller/promotions/promotions.controller";
import {stockPersonRoutes} from "@gateway/controller/stock/stockPerson.controller";
import {stockRoutes} from "@gateway/controller/stock/stock.controller";
import {logRoutes} from "@gateway/controller/log/log.controller";
import {metricRoutes} from "@gateway/controller/metric/metric.controller";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 50000;

app.use('/', userRoutes
// #swagger.tags = ['User']
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
app.use('/', promotionsRoutes
// #swagger.tags = ['Promotions']
);
app.use('/', stockRoutes
// #swagger.tags = ['Stock']
);
app.use('/', stockPersonRoutes
// #swagger.tags = ['StockPerson']
);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});