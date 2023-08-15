import express, {Router} from "express";
import {logServiceClient} from "@gateway/services/clients/log.client";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {GetLogRequest} from "@gateway/proto/log_pb";

export const logRoutes = Router();

logRoutes.get('/api/log', (req: express.Request, res: express.Response) => {

    logServiceClient.listLog(new Empty(), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

logRoutes.get('/api/log/:id', (req: express.Request, res: express.Response) => {
    const {id} = req.params

    logServiceClient.getLog(new GetLogRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});