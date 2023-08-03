import {Request, Response} from "express";
import {userController} from "@gateway/controller/user/userController";
import {orderController} from "@gateway/controller/order/orderController";
import {productController} from "@gateway/controller/product/productController";
import {categoryController} from "@gateway/controller/product/categoryController";
import {allergenController} from "@gateway/controller/product/allergenController";
import {deliveryController} from "@gateway/controller/delivery/deliveryController";
import {deliveryPersonController} from "@gateway/controller/delivery/deliveryPersonController";

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

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});