import {Request, Response, Router} from "express";
import {ProductRequest, RestaurantRequest, UserId} from "@gateway/proto/basket_pb";
import {basketServiceClient} from "@gateway/services/clients/basket.client";

export const basketRoutes = Router();

basketRoutes.get('/api/basket/:userId', (req: Request, res: Response) => {
    /* #swagger.parameters['userId'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }*/
    const {userId} = req.params;
    basketServiceClient.getBasket(new UserId().setId(Number(userId)), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

basketRoutes.post('/api/basket', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: 0,
                productId: "stringId",
                restaurantId:"stringId"
            }
    } */
    const {userId, productId, restaurantId} = req.body;
    const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
    basketServiceClient.addProduct(basketRequest, (error, response) => {
            if (error) {
                res.status(500).send({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.put('/api/basket/remove-product', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: 0,
                productId: "stringId",
                restaurantId:"stringId"
            }
    } */
    const {userId, productId, restaurantId} = req.body;
    const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
    basketServiceClient.deleteProduct(basketRequest, (error, response) => {
            if (error) {
                res.status(500).send({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.put('/api/basket/restaurant', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: 0,
                restaurantId:"stringId"
            }
    } */
    const {restaurantId, userId} = req.body;
    basketServiceClient.updateRestaurant(new RestaurantRequest().setRestaurantId(restaurantId).setUserId(userId), (error, response) => {
            if (error) {
                res.status(500).send({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.post('/api/basket/reset', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: 0,
            }
    } */
    const {userId} = req.body;
    basketServiceClient.reset(new UserId().setId(userId), (error, response) => {
            if (error) {
                res.status(500).send({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});
