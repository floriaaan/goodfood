import { stockPersonServiceClient } from "@gateway/services/clients/stock.client";
import { Request, Response, Router } from "express";
import { GetOutcomesByRestaurantRequest } from "@gateway/proto/stock_pb";

export const stockPersonRoutes = Router();

stockPersonRoutes.post("/api/stock/outcomes/by-restaurant/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                date: "2022-01-01T00:00:00.000Z",
                interval: "interval-example"
            }
    }  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
  const { id } = req.params;
  const { date, interval } = req.body;
  const outcomesByRestaurantRequest = new GetOutcomesByRestaurantRequest()
    .setRestaurantId(id)
    .setDate(date)
    .setInterval(interval);

  stockPersonServiceClient.getOutcomesByRestaurant(outcomesByRestaurantRequest, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
  });
});
