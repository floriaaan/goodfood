import {Request, Response, Router} from "express";
import {deliveryServiceClient} from "@gateway/services/clients/delivery.client";
import {Delivery, DeliveryCreateInput, DeliveryId, RestaurantId, Status, UserId} from "@gateway/proto/delivery_pb";

export const deliveryRoutes = Router();

deliveryRoutes.get('/api/delivery/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    deliveryServiceClient.getDelivery(new DeliveryId().setId(id), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryRoutes.get('/api/delivery/by-restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const restaurantId = new RestaurantId().setId(id);

    deliveryServiceClient.listDeliveriesByRestaurant(restaurantId, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryRoutes.get('/api/delivery/by-user/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = new UserId().setId(id);

    deliveryServiceClient.listDeliveriesByUser(userId, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryRoutes.post('/api/delivery', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                eta: "2022-01-01T00:00:00.000Z",
                address: "10 Rue de la République, 75003 Paris, France",
                status: {'$ref': '#/definitions/Status'},
                deliveryPersonId: "cllcdmeci0000pm01su98mxtb",
                userId: "user_id:1",
                restaurantId: "restaurant_id:1"
            }
      }
    */
    const {eta, address, status, deliveryPersonId, userId, restaurantId} = req.body;
    const deliveryStatus = Status[status] as unknown as Status;
    if (!deliveryStatus) {
        res.status(400).send({error: "Status not found"});
        return;
    }
    const deliveryCreateInput = new DeliveryCreateInput().setEta(eta)
        .setAddress(address)
        .setStatus(deliveryStatus)
        .setDeliveryPersonId(deliveryPersonId)
        .setUserId(userId)
        .setRestaurantId(restaurantId);

    deliveryServiceClient.createDelivery(deliveryCreateInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryRoutes.put('/api/delivery/:id', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                eta: "2022-01-01T00:00:00.000Z",
                address: "10 Rue de la République, 75003 Paris, France",
                status: {'$ref': '#/definitions/Status'},
                deliveryPersonId: "cllcdmeci0000pm01su98mxtb",
                userId: "user_id:1",
                restaurantId: "restaurant_id:1"
            }
      }
    */
    const {id} = req.params;
    const {eta, address, status, deliveryPersonId, userId, restaurantId} = req.body;
    const deliveryStatus = Status[status] as unknown as Status;
    if (!deliveryStatus) {
        res.status(400).send({error: "Status not found"});
        return;
    }
    const delivery = new Delivery().setId(id).setEta(eta)
        .setAddress(address)
        .setStatus(deliveryStatus)
        .setDeliveryPersonId(deliveryPersonId)
        .setUserId(userId)
        .setRestaurantId(restaurantId);

    deliveryServiceClient.updateDelivery(delivery, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryRoutes.delete('/api/delivery/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    deliveryServiceClient.deleteDelivery(new DeliveryId().setId(id), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});