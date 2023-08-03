import {Application, Request, Response} from "express";
import {deliveryServiceClient} from "@gateway/services/clients/delivery.client";
import {Delivery, DeliveryCreateInput, DeliveryId, RestaurantId, UserId} from "@gateway/proto/delivery_pb";

export const deliveryController = (app: Application) => {
    app.get('/api/delivery/:id', (req: Request, res: Response) => {
        const {id} = req.params;

        deliveryServiceClient.getDelivery(new DeliveryId().setId(id), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/delivery/by-restaurant/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const restaurantId = new RestaurantId().setId(id);

        deliveryServiceClient.listDeliveriesByRestaurant(restaurantId, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/delivery/by-user/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const userId = new UserId().setId(id);

        deliveryServiceClient.listDeliveriesByUser(userId, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.post('/api/delivery', (req: Request, res: Response) => {
        const {eta, address, status, deliveryPersonId, userId, restaurantId} = req.body;
        const deliveryCreateInput = new DeliveryCreateInput().setEta(eta)
            .setAddress(address)
            .setStatus(status)
            .setDeliveryPersonId(deliveryPersonId)
            .setUserId(userId)
            .setRestaurantId(restaurantId);

        deliveryServiceClient.createDelivery(deliveryCreateInput, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.put('/api/delivery/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const {eta, address, status, deliveryPersonId, userId, restaurantId} = req.body;
        const delivery = new Delivery().setId(id).setEta(eta)
            .setAddress(address)
            .setStatus(status)
            .setDeliveryPersonId(deliveryPersonId)
            .setUserId(userId)
            .setRestaurantId(restaurantId);

        deliveryServiceClient.updateDelivery(delivery, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.delete('/api/delivery/:id', (req: Request, res: Response) => {
        const {id} = req.params;

        deliveryServiceClient.deleteDelivery(new DeliveryId().setId(id), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
}