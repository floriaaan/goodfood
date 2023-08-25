import { Request, Response, Router } from "express";
import { logServiceClient } from "@gateway/services/clients/log.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { GetLogRequest } from "@gateway/proto/log_pb";
import { withCheck } from "@gateway/middleware/auth";

export const logRoutes = Router();

logRoutes.get("/api/log", withCheck({ role: "ADMIN" }), (_: Request, res: Response) => {
  /* #swagger.parameters['headers'] = {
        in: 'header',
        required: true,
        schema: {
            Authorization: "Bearer <token>"
        }
    } */
  logServiceClient.listLog(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.status(200).json(response.toObject());
  });
});

logRoutes.get("/api/log/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        schema: {
            id: "log_id:1"
        }
    }
    #swagger.parameters['headers'] = {
        in: 'header',
        required: true,
        schema: {
            Authorization: "Bearer <token>"
        }
    } */
  const { id } = req.params;

  logServiceClient.getLog(new GetLogRequest().setId(Number(id)), (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.status(200).json(response.toObject());
  });
});
