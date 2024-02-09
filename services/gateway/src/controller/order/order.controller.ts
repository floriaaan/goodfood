import { check, withCheck } from "@gateway/middleware/auth";
import {
  Basket as BasketSnapshot,
  CreateOrderRequest,
  DeleteOrderRequest,
  GetOrderByDeliveryRequest,
  GetOrderByPaymentRequest,
  GetOrderRequest,
  GetOrdersByRestaurantRequest,
  GetOrdersByStatusRequest,
  GetOrdersByUserRequest,
  Order,
  Status,
  UpdateOrderRequest,
  UserMinimum,
} from "@gateway/proto/order_pb";
import { User } from "@gateway/proto/user_pb";
import { getBasketByUser } from "@gateway/services/basket.service";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { Request, Response, Router } from "express";
import orderService from "../../services/clients/order.client";
import { restaurantServiceClient } from "@gateway/services/clients";
import { Restaurant, RestaurantId } from "@gateway/proto/restaurant_pb";
import { getPayment } from "@gateway/services/payment.service";
import { getDelivery } from "@gateway/services/delivery.service";

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
    const payment = await getPayment(order.paymentId);
    const delivery = await getDelivery(order.deliveryId);
    return res.status(200).json({ ...order, payment: payment?.toObject(), delivery: delivery?.toObject() });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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

  orderService.createOrder(orderInput, async (error, response) => {
    const order = response.toObject();
    const payment = await getPayment(order.paymentId);
    const delivery = await getDelivery(order.deliveryId);
    if (error) return res.status(500).send({ error });
    else return res.status(200).json({ ...order, payment: payment?.toObject(), delivery: delivery?.toObject() });
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
  if (!(await check(token, { role: "ADMIN" })) || !(await check(token, { id: userId })))
    return res.status(401).send({ error: "Unauthorized" });
  // ----------------------------

  const orderInput = new GetOrdersByUserRequest().setId(userId);
  orderService.getOrdersByUser(orderInput, async (error, response) => {
    if (error) return res.status(500).send({ error });
    const r = response.toObject();
    const ordersList = await Promise.all(
      r.ordersList.map(async (order) => {
        const payment = await getPayment(order.paymentId);
        const delivery = await getDelivery(order.deliveryId);
        return { ...order, payment: payment?.toObject(), delivery: delivery?.toObject() };
      }),
    );
    return res.status(200).json({ ordersList });
  });
});

orderRoutes.get(
  "/api/order/by-status/:status",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /* #swagger.parameters['status'] = {
        in: 'path',
        required: true,
        type: 'string'
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
    const status = req.params.status as keyof typeof Status;
    const orderInput = new GetOrdersByStatusRequest().setStatus(Status[status]);

    orderService.getOrdersByStatus(orderInput, async (error, response) => {
      if (error) return res.status(500).send({ error });
      const r = response.toObject();
      const ordersList = await Promise.all(
        r.ordersList.map(async (order) => {
          const payment = await getPayment(order.paymentId);
          const delivery = await getDelivery(order.deliveryId);
          return { ...order, payment: payment?.toObject(), delivery: delivery?.toObject() };
        }),
      );
      return res.status(200).json({ ordersList });
    });
  },
);

orderRoutes.get(
  "/api/order/by-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized", cause: "authorization not found" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized", cause: "userId not found" });
    const user = await getUser(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized", cause: "user not found" });

    const role = user.getRole()?.getCode();
    if (role === undefined) return res.status(401).json({ message: "Unauthorized", cause: "role is undefined" });
    if (role !== "ADMIN" && role !== "MANAGER")
      return res.status(401).json({ message: "Unauthorized", cause: "role is not ADMIN or MANAGER" });
    // ----------------------------

    const { id } = req.params;

    try {
      const restaurant = (await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      })) as Restaurant.AsObject;
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      if (!restaurant.useridsList.includes(userId) && role !== "ADMIN")
        return res.status(401).json({ message: "Unauthorized", cause: "user is not in restaurant and is not ADMIN" });

      orderService.getOrdersByRestaurant(
        new GetOrdersByRestaurantRequest().setId(restaurant.id),
        async (error, response) => {
          if (error) return res.status(500).send({ error });
          const r = response.toObject();
          const ordersList = await Promise.all(
            r.ordersList.map(async (order) => {
              const payment = await getPayment(order.paymentId);
              const delivery = await getDelivery(order.deliveryId);
              return { ...order, payment: payment?.toObject(), delivery: delivery?.toObject() };
            }),
          );
          return res.status(200).json({ ordersList });
        },
      );
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
);

orderRoutes.get("/api/order/by-delivery/:deliveryId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['deliveryId'] = {
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

  // TODO: check for user in deliveries

  const { deliveryId } = req.query as { deliveryId: string };
  const orderInput = new GetOrderByDeliveryRequest().setId(deliveryId);
  orderService.getOrderByDelivery(orderInput, async (error, response) => {
    const order = response.toObject();
    const payment = await getPayment(order.paymentId);
    if (error) return res.status(500).send({ error });
    else return res.status(200).json({ ...order, payment: payment?.toObject() });
  });
});

orderRoutes.get("/api/order/by-payment/:paymentId", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['paymentId'] = {
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

  // TODO: check for user in payments

  const { paymentId } = req.params;
  const orderInput = new GetOrderByPaymentRequest().setId(paymentId);
  orderService.getOrderByPayment(orderInput, async (error, response) => {
    const order = response.toObject();
    const payment = await getPayment(order.paymentId);
    const delivery = await getDelivery(order.deliveryId);
    if (error) return res.status(500).send({ error });
    else return res.status(200).json({ ...order, payment: payment?.toObject(), delivery: delivery?.toObject() });
  });
});

orderRoutes.put("/api/order/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
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
    }
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
    } */
  const { id } = req.params;
  const { status, deliveryId, paymentId, restaurantId } = req.body;
  const orderInput = new UpdateOrderRequest()
    .setId(id)
    .setStatus(status)
    .setDeliveryId(deliveryId)
    .setPaymentId(paymentId)
    .setRestaurantId(restaurantId);
  orderService.updateOrder(orderInput, async (error, response) => {
    const order = response.toObject();
    const payment = await getPayment(order.paymentId);
    const delivery = await getDelivery(order.deliveryId);
    if (error) return res.status(500).send({ error });
    else return res.status(200).json({ ...order, payment: payment?.toObject(), delivery: delivery?.toObject() });
  });
});

orderRoutes.put("/api/order/claim/:id", async (req: Request, res: Response) => {
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
    }
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
    } */
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];

  // ----------------------------

  const { id } = req.params;
  const order: Order.AsObject = await new Promise((resolve, reject) => {
    orderService.getOrder(new GetOrderRequest().setId(id), (error, response) => {
      if (error) reject(error);
      else resolve(response.toObject());
    });
  });

  if (!(await check(token, { id: order.user?.id }))) return res.status(401).send({ error: "Unauthorized" });
  const orderInput = new UpdateOrderRequest()
    .setId(id)
    .setStatus(Status.FULFILLED)
    .setDeliveryId(order.deliveryId)
    .setPaymentId(order.paymentId)
    .setRestaurantId(order.restaurantId);
  orderService.updateOrder(orderInput, async (error, response) => {
    const order = response.toObject();
    const payment = await getPayment(order.paymentId);
    const delivery = await getDelivery(order.deliveryId);
    if (error) return res.status(500).send({ error });
    else return res.status(200).json({ ...order, payment: payment?.toObject(), delivery: delivery?.toObject() });
  });
});

orderRoutes.delete("/api/order/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
)        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
    } */
  const { id } = req.params;
  const orderInput = new DeleteOrderRequest().setId(id);
  orderService.deleteOrder(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
