import orderService from '../../services/clients/order.client';
import {Request, Response, Router} from "express";
import {
    Basket as BasketSnapshot,
    CreateOrderRequest,
    DeleteOrderRequest,
    GetOrderByDeliveryRequest,
    GetOrderByPaymentRequest,
    GetOrderRequest,
    GetOrdersByStatusRequest,
    GetOrdersByUserRequest,
    UpdateOrderRequest,
    UserMinimum
} from "@gateway/proto/order_pb";
import {getUser} from "@gateway/services/user.service";
import {User} from "@gateway/proto/user_pb";
import {getBasketByUser} from "@gateway/services/basket.service";

export const orderRoutes = Router();

orderRoutes.get('/api/order/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const orderId = new GetOrderRequest();
    orderId.setId(id);

    orderService.getOrder(orderId, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

//TODO: to test this route with the user and basket service
orderRoutes.post('/api/order', async (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                userId: 0,
                paymentId: "payment_id:1",
                deliveryId: "delivery_id:1",
                deliveryType :{'$ref': '#/definitions/DeliveryType'},
                restaurantId :"restaurant_id:1"
            }
      }*/
    const {userId, paymentId, deliveryId, deliveryType, restaurantId} = req.body;
    let user: User | undefined = undefined;
    try {
       user = await getUser(Number(userId));
    } catch (e) {
        return res.status(500).send({error: e});
    }

    if (!user) 
        return res.status(404).send({error: "User not found"});
    

    const miniUser = new UserMinimum().setId(String(user.getId()))
        .setEmail(user.getEmail())
        .setFirstName(user.getFirstName())
        .setLastName(user.getLastName())
        .setPhone(user.getPhone());

    let orderBasket: BasketSnapshot | undefined = undefined;
    try {
        const basket = (await getBasketByUser(userId))?.toObject();
        if (basket) orderBasket = new BasketSnapshot().setString(JSON.stringify(basket));
    } catch (e: any) {
        res.status(500).send({error: e.message});
    }

    let orderInput = new CreateOrderRequest()
        .setUser(miniUser)
        .setPaymentId(paymentId)
        .setDeliveryId(deliveryId)
        .setDeliveryType(deliveryType)
        .setBasketSnapshot(orderBasket)
        .setRestaurantId(restaurantId);

    orderService.createOrder(orderInput, (error, response) => {
        if (error) 
            return res.status(500).send({error: error.message});
         else 
            return res.json(response.toObject());
    });
});

orderRoutes.get('/api/order/by-user/:userId', (req: Request, res: Response) => {
    const {userId} = req.params;
    const orderInput = new GetOrdersByUserRequest().setId(userId);
    orderService.getOrdersByUser(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.post('/api/order/by-status', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                status :{'$ref': '#/definitions/Status'},
            }
      }*/
    const orderInput = new GetOrdersByStatusRequest().setStatus(req.body.status);

    orderService.getOrdersByStatus(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.get('/api/order/by-delivery/:deliveryId', (req: Request, res: Response) => {
    const {deliveryId} = req.params;
    const orderInput = new GetOrderByDeliveryRequest().setId(deliveryId);
    orderService.getOrderByDelivery(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.get('/api/order/by-payment/:paymentId', (req: Request, res: Response) => {
    const {paymentId} = req.params;
    const orderInput = new GetOrderByPaymentRequest().setId(paymentId);
    orderService.getOrderByPayment(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.put('/api/order/:orderId', (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                status :{'$ref': '#/definitions/Status'},
                deliveryId: "delivery_id:1",
                paymentId: "payment_id:1",
                restaurantId :"restaurant_id:1"
            }
      }*/
    const {orderId} = req.params;
    const {status, deliveryId, paymentId, restaurantId} = req.body;
    const orderInput = new UpdateOrderRequest()
        .setId(orderId)
        .setStatus(status)
        .setDeliveryId(deliveryId)
        .setPaymentId(paymentId)
        .setRestaurantId(restaurantId);
    orderService.updateOrder(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.delete('/api/order/:orderId', (req: Request, res: Response) => {
    const {orderId} = req.params;
    const orderInput = new DeleteOrderRequest().setId(orderId);
    orderService.deleteOrder(orderInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});