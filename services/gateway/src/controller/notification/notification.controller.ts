import { Router } from "express";
import { notificationServiceClient } from "@gateway/services/clients/notification.client";
import {
  MessageType,
  MessageTypeInput,
  Notification,
  NotificationCreateInput,
  NotificationId,
} from "@gateway/proto/notification_pb";
import { withCheck } from "@gateway/middleware/auth";

export const notificationRoutes = Router();

notificationRoutes.post("/api/notification/by-message-type", (req, res) => {
  /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              messageType: {'$ref': "#/definitions/MessageType"}
              }
      } */

  const { messageType }: { messageType: keyof typeof MessageType } = req.body;

  notificationServiceClient.getNotifications(
    new MessageTypeInput().setMessageType(MessageType[messageType]),
    (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    },
  );
});

notificationRoutes.get("/api/notification/:id", (req, res) => {
  /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'string'
      } */

  const { id } = req.params;

  notificationServiceClient.getNotification(new NotificationId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.post("/api/notification", withCheck({ role: ["ADMIN"] }), (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            title: "notification-title",
            message: "notification-message",
            messageType: {'$ref': "#/definitions/MessageType"}
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  const { title, message, messageType }: { title: string; message: string; messageType: keyof typeof MessageType } =
    req.body;
  const notificationCreateInput = new NotificationCreateInput()
    .setTitle(title)
    .setMessage(message)
    .setMessageType(MessageType[messageType]);
  notificationServiceClient.createNotification(notificationCreateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

notificationRoutes.put("/api/notification/:id", withCheck({ role: ["ADMIN"] }), (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            title: "notification-title",
            message: "notification-message",
            messageType: {'$ref': "#/definitions/MessageType"}
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
  const { title, message, messageType }: { title: string; message: string; messageType: keyof typeof MessageType } =
    req.body;
  const notificationCreateInput = new Notification()
    .setId(id)
    .setTitle(title)
    .setMessage(message)
    .setMessageType(MessageType[messageType]);
  notificationServiceClient.updateNotification(notificationCreateInput, (error, response) => {
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
  notificationServiceClient.deleteNotification(new NotificationId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
