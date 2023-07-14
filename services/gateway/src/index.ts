import {Request, Response} from "express";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 50000;

app.get('/', (req: Request, res: Response) => {
    res.send('Node.js API Gateway is up and running!');
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});