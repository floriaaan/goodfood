import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Notification } from "@mock/types";

export const notificationRoutes = Router();

notificationRoutes.post("/api/notification", (req: Request, res: Response) => {
  const notification: Notification = {
    id: `notification-${db.notifications.length + 1}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.notifications.push(notification);
  return res.status(201).json(notification);
});

notificationRoutes.get("/api/notification/user/:id", (req: Request, res: Response) => {
  const list = db.notifications.filter((n) => n.userId === req.params.id);
  return res.status(200).json({ notificationsList: list });
});

notificationRoutes.get("/api/notification/restaurant/:id", withCheck({ role: ["ADMIN", "MANAGER"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ notificationsList: db.notifications });
});

notificationRoutes.get("/api/notification/:id", (req: Request, res: Response) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(notification);
});

notificationRoutes.put("/api/notification/:id/read", (req: Request, res: Response) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: "Not found" });
  notification.read = true;
  return res.status(200).json(notification);
});

notificationRoutes.put("/api/notification/:id", withCheck({ role: ["ADMIN", "MANAGER"] }), (req: Request, res: Response) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: "Not found" });
  Object.assign(notification, req.body);
  return res.status(200).json(notification);
});

notificationRoutes.delete("/api/notification/:id", withCheck({ role: ["ADMIN"] }), (req: Request, res: Response) => {
  const index = db.notifications.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.notifications.splice(index, 1);
  return res.status(200).json(removed);
});
