import {Request, Response} from "express";
import {userController} from "@gateway/controller/user/user.controller";
import {orderController} from "@gateway/controller/order/order.controller";
import {productController} from "@gateway/controller/product/product.controller";
import {categoryController} from "@gateway/controller/product/category.controller";
import {allergenController} from "@gateway/controller/product/allergen.controller";
import {deliveryController} from "@gateway/controller/delivery/delivery.controller";
import {deliveryPersonController} from "@gateway/controller/delivery/deliveryPerson.controller";
import {promotionsController} from "@gateway/controller/promotions/promotions.controller";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 50000;

app.get('/', (req: Request, res: Response) => {
    res.send('Node.js API Gateway is up and running!');
});

userController(app);
orderController(app);
categoryController(app);
allergenController(app);
productController(app);
deliveryController(app);
deliveryPersonController(app);
promotionsController(app);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});