import { check, withCheck } from "@gateway/middleware/auth";
import { Address, Delivery } from "@gateway/proto/delivery_pb";
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
import { Restaurant, RestaurantId } from "@gateway/proto/restaurant_pb";
import { User } from "@gateway/proto/user_pb";
import { getBasketByUser, resetBasketByUser } from "@gateway/services/basket.service";
import { restaurantServiceClient } from "@gateway/services/clients";
import { createDelivery } from "@gateway/services/delivery.service";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { Request, Response, Router } from "express";
import orderService from "../../services/clients/order.client";
import { getRestaurant } from "@gateway/services/restaurant.service";

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

//TODO: to test this route with the user and basket service
orderRoutes.post("/api/order/tmp", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                paymentId: "payment_id:1",
                deliveryType :{'$ref': '#/definitions/DeliveryType'},
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

  const { paymentId, deliveryType } = req.body;
  let user: User | undefined = undefined;
  try {
    user = await getUser(userId);
  } catch (error) {
    return res.status(500).send({ error });
  }

  if (!user) return res.status(404).send({ error: "User not found" });
  const userToObj = user.toObject();
  const miniUser = new UserMinimum()
    .setId(String(userToObj.id))
    .setEmail(userToObj.email)
    .setFirstName(userToObj.firstName)
    .setLastName(userToObj.lastName)
    .setPhone(userToObj.phone);

  let orderBasket: BasketSnapshot | undefined = undefined;
  let restaurantId = "";
  try {
    const basket = (await getBasketByUser(userId.toString()))?.toObject();
    if (basket) {
      orderBasket = new BasketSnapshot().setString(JSON.stringify(basket));
      restaurantId = basket.restaurantId;
    } else {
      return res.status(404).send({ error: "Basket not found" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }

  let delivery: Delivery | undefined = undefined;
  try {
    const restaurant = await getRestaurant(restaurantId);
    if (!restaurant || restaurant.hasAddress()) return res.status(404).send({ error: "Restaurant not found" });
    delivery = await createDelivery(
      new Address().setLat(user.getMainaddress()!.getLat()).setLng(user.getMainaddress()!.getLng()),
      userId,
      restaurantId,
      new Address().setLat(restaurant.getAddress()!.getLat()).setLng(restaurant.getAddress()!.getLat()),
    );
    if (!delivery?.getId()) throw delivery;
  } catch (error) {
    return res.status(500).send({ error });
  }

  const orderInput = new CreateOrderRequest()
    .setUser(miniUser)
    .setPaymentId(paymentId)
    .setDeliveryId(delivery.getId())
    .setDeliveryType(deliveryType)
    .setBasketSnapshot(orderBasket)
    .setRestaurantId(restaurantId);
  try {
    const order: Order.AsObject = await new Promise((resolve, reject) => {
      orderService.createOrder(orderInput, (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    });
    await resetBasketByUser(userId.toString());
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).send({ error });
  }
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
  orderService.getOrdersByUser(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
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

    orderService.getOrdersByStatus(orderInput, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
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

      orderService.getOrdersByRestaurant(new GetOrdersByRestaurantRequest().setId(restaurant.id), (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      });
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
  orderService.getOrderByPayment(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
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
  orderService.updateOrder(orderInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
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
