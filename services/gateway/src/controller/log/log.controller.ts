import { Request, Response, Router } from "express";
import { logServiceClient } from "@gateway/services/clients/log.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { GetLogRequest } from "@gateway/proto/log_pb";
import { withCheck } from "@gateway/middleware/auth";

export const logRoutes = Router();

logRoutes.get("/api/log", withCheck({ role: "ADMIN" }), (_: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
          type: 'string'
    } */
  logServiceClient.listLog(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.status(200).json(response.toObject());
  });
});

logRoutes.get("/api/log/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'number'
     } */
  const { id } = req.params;

  logServiceClient.getLog(new GetLogRequest().setId(Number(id)), (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.status(200).json(response.toObject());
  });
});
