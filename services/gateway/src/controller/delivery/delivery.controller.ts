import { Request, Response, Router } from "express";
import { deliveryServiceClient } from "@gateway/services/clients/delivery.client";
import { Delivery, DeliveryCreateInput, DeliveryId, RestaurantId, Status, UserId } from "@gateway/proto/delivery_pb";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { check, withCheck } from "@gateway/middleware/auth";

export const deliveryRoutes = Router();

deliveryRoutes.get("/api/delivery/:id", async (req: Request, res: Response) => {
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

  try {
    const delivery: Delivery.AsObject = await new Promise((resolve, reject) => {
      deliveryServiceClient.getDelivery(new DeliveryId().setId(id), (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    });

    if (delivery.userId !== userId.toString()) return res.status(401).json({ message: "Unauthorized" });
    else return res.status(200).json(delivery);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

deliveryRoutes.get(
  "/api/delivery/by-restaurant/:id",
  withCheck({ role: ["ACCOUNTANT", "ADMIN"] }),
  (req: Request, res: Response) => {
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

    const { id } = req.params;
    const restaurantId = new RestaurantId().setId(id);

    deliveryServiceClient.listDeliveriesByRestaurant(restaurantId, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

deliveryRoutes.get("/api/delivery/by-user", async (req: Request, res: Response) => {
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

  deliveryServiceClient.listDeliveriesByUser(new UserId().setId(userId.toString()), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryRoutes.post("/api/delivery", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                eta: "2022-01-01T00:00:00.000Z",
                address: "10 Rue de la République, 75003 Paris, France",
                deliveryPersonId: "cllcdmeci0000pm01su98mxtb",
                restaurantId: "restaurant_id:1"
            }
      }
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } 
    */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { eta, address, deliveryPersonId, restaurantId } = req.body;
  const deliveryStatus = Status.PENDING;
  // if (!deliveryStatus) return res.status(400).send({ error: "Status not found" });

  const deliveryCreateInput = new DeliveryCreateInput()
    .setEta(eta)
    .setAddress(address)
    .setStatus(deliveryStatus)
    .setDeliveryPersonId(deliveryPersonId)
    .setUserId(userId.toString())
    .setRestaurantId(restaurantId);

  deliveryServiceClient.createDelivery(deliveryCreateInput, (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.status(201).json(response.toObject());
  });
});

deliveryRoutes.put("/api/delivery/:id", async (req: Request, res: Response) => {
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
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const isAuthentified = (await getUserIdFromToken(token)) !== undefined;
  if (!isAuthentified) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;
  const { eta, address, status, deliveryPersonId, userId, restaurantId } = req.body;
  const deliveryStatus = Status[status] as unknown as Status;
  if (!deliveryStatus) return res.status(400).send({ error: "Status not found" });

  const delivery = new Delivery()
    .setId(id)
    .setEta(eta)
    .setAddress(address)
    .setStatus(deliveryStatus)
    .setDeliveryPersonId(deliveryPersonId)
    .setUserId(userId)
    .setRestaurantId(restaurantId);

  deliveryServiceClient.updateDelivery(delivery, (error, response) => {
    if (error) return res.status(500).send({ error: error.message });
    else return res.json(response.toObject());
  });
});

deliveryRoutes.delete("/api/delivery/:id", async (req: Request, res: Response) => {
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

  const { id } = req.params;

  try {
    const delivery: Delivery.AsObject = await new Promise((resolve, reject) => {
      deliveryServiceClient.getDelivery(new DeliveryId().setId(id), (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    });

    if (Number(delivery.userId) !== userId || !(await check(token, { role: "ADMIN" })))
      return res.status(401).json({ message: "Unauthorized" });

    deliveryServiceClient.deleteDelivery(new DeliveryId().setId(id), (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});
