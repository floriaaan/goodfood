import {stockPersonServiceClient} from "@gateway/services/clients/stock.client";
import {Application, Request, Response} from "express";
import {GetOutcomesByRestaurantRequest} from "@gateway/proto/stock_pb";


export const stockPersonController = (app: Application) => {
    app.post('/api/stock/outcomes/by-restaurant/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const {date, interval} = req.body;
        const outcomesByRestaurantRequest = new GetOutcomesByRestaurantRequest().setRestaurantId(id).setDate(date).setInterval(interval);

        stockPersonServiceClient.getOutcomesByRestaurant(outcomesByRestaurantRequest, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
}