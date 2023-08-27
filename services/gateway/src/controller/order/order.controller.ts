import orderService from "../../services/clients/order.client";
import { Request, Response, Router } from "express";
import {
  Basket as BasketSnapshot,
  CreateOrderRequest,
  DeleteOrderRequest,
  GetOrderByDeliveryRequest,
  GetOrderByPaymentRequest,
  GetOrderRequest,
  GetOrdersByStatusRequest,
  GetOrdersByUserRequest,
  Order,
  Status,
  UpdateOrderRequest,
  UserMinimum,
} from "@gateway/proto/order_pb";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { User } from "@gateway/proto/user_pb";
import { getBasketByUser } from "@gateway/services/basket.service";
import { check, withCheck } from "@gateway/middleware/auth";

export const orderRoutes = Router();

orderRoutes.get("/api/order/:id", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;
  const orderId = new GetOrderRequest();
  orderId.setId(id);

  try {
    const order: Order.AsObject = await new Promise((resolve, reject) => {
      orderService.getOrder(orderId, (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    });

    if (!order) return res.status(404).send({ error: "Order not found" });
    if (order.user?.id !== userId.toString() || !(await check(token, { role: "ADMIN" })))
      return res.status(401).send({ error: "Unauthorized" });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

//TODO: to test this route with the user and basket service
orderRoutes.post("/api/order", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                paymentId: "payment_id:1",
                deliveryId: "delivery_id:1",
                deliveryType :{'$ref': '#/definitions/DeliveryType'},
                restaurantId :"restaurant_id:1"
            }
      }
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { paymentId, deliveryId, deliveryType, restaurantId } = req.body;
  let user: User | undefined = undefined;
  try {
    user = await getUser(userId);
  } catch (error) {
    return res.status(500).send({ error });
  }

  if (!user) return res.status(404).send({ error: "User not found" });

  const miniUser = new UserMinimum()
    .setId(String(user.getId()))
    .setEmail(user.getEmail())
    .setFirstName(user.getFirstName())
    .setLastName(user.getLastName())
    .setPhone(user.getPhone());

  let orderBasket: BasketSnapshot | undefined = undefined;
  try {
    const basket = (await getBasketByUser(userId.toString()))?.toObject();
    if (basket) orderBasket = new BasketSnapshot().setString(JSON.stringify(basket));
  } catch (error) {
    return res.status(500).send({ error });
  }

  const orderInput = new CreateOrderRequest()
    .setUser(miniUser)
    .setPaymentId(paymentId)
    .setDeliveryId(deliveryId)
    .setDeliveryType(deliveryType)
    .setBasketSnapshot(orderBasket)
    .setRestaurantId(restaurantId);

  orderService.createOrder(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.get("/api/order/by-user/:userId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];

  const { userId } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!(await check(token, { role: "ADMIN" })) || !(await check(token, { id: Number(userId) })))
    return res.status(401).send({ error: "Unauthorized" });
  // ----------------------------

  const orderInput = new GetOrdersByUserRequest().setId(userId);
  orderService.getOrdersByUser(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.post("/api/order/by-status", withCheck({ role: "ACCOUNTANT" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            status :{'$ref': '#/definitions/Status'},
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { status }: { status: keyof typeof Status } = req.body;
  const orderInput = new GetOrdersByStatusRequest().setStatus(Status[status]);

  orderService.getOrdersByStatus(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.get("/api/order/by-delivery/:deliveryId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  // TODO: check for user in deliveries

  const { deliveryId } = req.query as { deliveryId: string };
  const orderInput = new GetOrderByDeliveryRequest().setId(deliveryId);
  orderService.getOrderByDelivery(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.get("/api/order/by-payment/:paymentId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  // TODO: check for user in payments

  const { paymentId } = req.params;
  const orderInput = new GetOrderByPaymentRequest().setId(paymentId);
  orderService.getOrderByPayment(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.put("/api/order/:orderId", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            status :{'$ref': '#/definitions/Status'},
            deliveryId: "delivery_id:1",
            paymentId: "payment_id:1",
            restaurantId :"restaurant_id:1"
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }*/
  const { orderId } = req.params;
  const { status, deliveryId, paymentId, restaurantId } = req.body;
  const orderInput = new UpdateOrderRequest()
    .setId(orderId)
    .setStatus(status)
    .setDeliveryId(deliveryId)
    .setPaymentId(paymentId)
    .setRestaurantId(restaurantId);
  orderService.updateOrder(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

orderRoutes.delete("/api/order/:orderId", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
)        in: 'header',
        required: true,
        type: 'string'
    }*/
  const { orderId } = req.params;
  const orderInput = new DeleteOrderRequest().setId(orderId);
  orderService.deleteOrder(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
