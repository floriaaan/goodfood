import orderService from '../../services/clients/order.client';
import {Request, Response, Router} from "express";
import {
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

export const orderRoutes = Router();

orderRoutes.get('/api/order/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const orderId = new GetOrderRequest();
    orderId.setId(id);

    orderService.getOrder(orderId, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.post('/api/order', (req: Request, res: Response) => {
    const body = req.body;
    let user: User | undefined = undefined;
    try {
        user = getUser(Number(req.body.userId));
    } catch (e: any) {
        res.json({error: e.message});
    }

    if (!user) {
        res.json({error: "User not found"});
        return;
    }

    const miniUser = new UserMinimum().setId(String(user.getId()))
        .setEmail(user.getEmail())
        .setFirstName(user.getFirstName())
        .setLastName(user.getLastName())
        .setPhone(user.getPhone());

    let orderInput = new CreateOrderRequest()
        .setUser(miniUser)
        .setPaymentId(body.paymentId)
        .setDeliveryId(body.deliveryId)
        .setDeliveryType(body.deliveryType)
        .setBasketSnapshot(body.basketSnapshot)
        .setRestaurantId(body.restaurantId);

    orderService.createOrder(orderInput, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.get('/api/order/by-user/:userId', (req: Request, res: Response) => {
    const {userId} = req.params;
    const orderInput = new GetOrdersByUserRequest().setId(userId);
    orderService.getOrdersByUser(orderInput, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.post('/api/order/by-status', (req: Request, res: Response) => {
    const orderInput = new GetOrdersByStatusRequest().setStatus(req.body.status);

    orderService.getOrdersByStatus(orderInput, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
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
            res.status(500)
            res.json({error: error.message});
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
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

orderRoutes.put('/api/order/:orderId', (req: Request, res: Response) => {
    const {orderId} = req.params;
    const orderInput = new UpdateOrderRequest()
        .setId(orderId)
        .setStatus(req.body.status)
        .setDeliveryId(req.body.deliveryId)
        .setPaymentId(req.body.paymentId)
        .setRestaurantId(req.body.restaurantId);
    orderService.updateOrder(orderInput, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
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
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});