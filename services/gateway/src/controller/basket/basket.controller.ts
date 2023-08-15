import {Request, Response, Router} from "express";
import {ProductRequest, RestaurantRequest, UserId} from "@gateway/proto/basket_pb";
import {basketServiceClient} from "@gateway/services/clients/basket.client";

export const basketRoutes = Router();

basketRoutes.get('/api/basket/:userId', (req: Request, res: Response) => {
    const {userId} = req.params;

    basketServiceClient.getBasket(new UserId().setId(Number(userId)), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

basketRoutes.post('/api/basket', (req: Request, res: Response) => {
    const {userId, productId, restaurantId} = req.body;
    const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
    basketServiceClient.addProduct(basketRequest, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.delete('/api/basket', (req: Request, res: Response) => {
    const {userId, productId, restaurantId} = req.body;
    const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
    basketServiceClient.deleteProduct(basketRequest, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.put('/api/basket/restaurant', (req: Request, res: Response) => {
    const {restaurantId, userId} = req.body;
    basketServiceClient.updateRestaurant(new RestaurantRequest().setRestaurantId(restaurantId).setUserId(userId), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});

basketRoutes.post('/api/basket/reset', (req: Request, res: Response) => {
    const {userId} = req.body;
    basketServiceClient.reset(new UserId().setId(userId), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        }
    );
});
