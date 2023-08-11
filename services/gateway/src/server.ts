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

app.use('/', userRoutes);
app.use('/', orderRoutes);
app.use('/', categoryRoutes);
app.use('/', allergenRoutes);
app.use('/', productRoutes);
app.use('/', deliveryRoutes);
app.use('/', deliveryPersonRoutes);
app.use('/', logRoutes);
app.use('/', metricRoutes);
app.use('/', promotionsRoutes);
app.use('/', stockRoutes);
app.use('/', stockPersonRoutes);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});