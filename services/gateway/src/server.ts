import {Request, Response} from "express";
import {userController} from "@order/controller/user/userController";
import {orderController} from "@order/controller/order/orderController";

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

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});