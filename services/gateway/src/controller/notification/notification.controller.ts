import { check, withCheck } from "@gateway/middleware/auth";
import {
  CreateNotificationRequest,
  GetNotificationsByRestaurantIdRequest,
  GetNotificationsByUserIdRequest,
  MessageType,
  NotificationIdRequest,
  UpdateNotificationRequest,
} from "@gateway/proto/notification_pb";
import { Restaurant, RestaurantId } from "@gateway/proto/restaurant_pb";
import { notificationServiceClient } from "@gateway/services/clients/notification.client";
import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { Router } from "express";

export const notificationRoutes = Router();

notificationRoutes.post("/api/notification", async (req, res) => {
  /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              title: "notification-title",
              description: "notification-description",
              icon: "notification-icon",
              image: "notification-image",
              callback_url: "notification-callback_url",
              type: {'$ref': "#/definitions/MessageType"},
              user_id: "notification-user_id",
              restaurant_id: "notification-restaurant_id",
          }
      }
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     */

  // Auth check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { title, description, icon, image, callback_url, user_id, restaurant_id } = req.body;
  const type = req.body.type as keyof typeof MessageType;

  // if type is not USER_CLAIM, only a manager or admin can create the notification
  // if type is USER_CLAIM, only the user can create the notification
  if (type !== "USER_CLAIM" && (await check(token, { role: ["MANAGER", "ADMIN"] })))
    return res.status(403).json({ message: "Forbidden" });

  const request = new CreateNotificationRequest()
    .setTitle(title)
    .setDescription(description)
    .setIcon(icon)
    .setImage(image)
    .setCallbackUrl(callback_url)
    .setType(type as unknown as MessageType)
    .setUserId(user_id)
    .setRestaurantId(restaurant_id);

  notificationServiceClient.createNotification(request, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.get("/api/notification/user/:id", async (req, res) => {
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

  // Auth check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (userId !== req.params.id && !(await check(token, { role: "ADMIN" })))
    return res.status(403).json({ message: "Forbidden" });
  // ----------------------------

  const { id } = req.params;

  notificationServiceClient.getNotificationsByUserId(
    new GetNotificationsByUserIdRequest().setUserId(id),
    (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    },
  );
});

notificationRoutes.get(
  "/api/notification/restaurant/:id",
  withCheck({ role: ["ADMIN", "MANAGER"] }),
  async (req, res) => {
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

    // Auth check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const restaurant = (await new Promise((resolve, reject) => {
      restaurantServiceClient.getRestaurant(new RestaurantId().setId(req.params.id), (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    })) as Restaurant.AsObject;
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId))
      return res.status(403).json({ message: "Forbidden" });
    // ----------------------------

    const { id } = req.params;

    notificationServiceClient.getNotificationsByRestaurantId(
      new GetNotificationsByRestaurantIdRequest().setRestaurantId(id),
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

notificationRoutes.get("/api/notification/:id", async (req, res) => {
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

  // Auth check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;

  notificationServiceClient.getNotification(new NotificationIdRequest().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.put("/api/notification/:id/read", (req, res) => {
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
  notificationServiceClient.readNotification(new NotificationIdRequest().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.put("/api/notification/:id", withCheck({ role: ["ADMIN", "MANAGER"] }), (req, res) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'string'
      }
    #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              title: "notification-title",
              description: "notification-description",
              icon: "notification-icon",
              image: "notification-image",
              callback_url: "notification-callback_url",
              type: {'$ref': "#/definitions/MessageType"},
              user_id: "notification-user_id",
              restaurant_id: "notification-restaurant_id",
          }
      } */

  const { id } = req.params;
  const { title, description, icon, image, callback_url } = req.body;

  const request = new UpdateNotificationRequest()
    .setId(id)
    .setTitle(title)
    .setDescription(description)
    .setIcon(icon)
    .setImage(image)
    .setCallbackUrl(callback_url);

  notificationServiceClient.updateNotification(request, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.delete("/api/notification/:id", withCheck({ role: ["ADMIN"] }), (req, res) => {
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
  notificationServiceClient.deleteNotification(new NotificationIdRequest().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
