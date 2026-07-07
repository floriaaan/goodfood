import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { decodeToken, getTokenFromHeader, withCheck } from "@mock/lib/auth";
import { Delivery, DeliveryPerson, Status } from "@mock/types";

export const deliveryRoutes = Router();

deliveryRoutes.get("/api/delivery/by-restaurant/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const list = db.deliveries.filter((d) => d.restaurant_id === req.params.id);
  return res.status(200).json({ deliveriesList: list });
});

deliveryRoutes.get("/api/delivery/by-user", (req: Request, res: Response) => {
  const userId = decodeToken(getTokenFromHeader(req) ?? "")?.id;
  const list = db.deliveries.filter((d) => d.user_id === userId);
  return res.status(200).json({ deliveriesList: list });
});

deliveryRoutes.get("/api/delivery/by-delivery-person", (req: Request, res: Response) => {
  const deliveryPersonId = decodeToken(getTokenFromHeader(req) ?? "")?.id;
  const list = db.deliveries.filter((d) => d.delivery_person_id === deliveryPersonId);
  return res.status(200).json({ deliveriesList: list });
});

deliveryRoutes.get("/api/delivery/:id", (req: Request, res: Response) => {
  const delivery = db.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(delivery);
});

deliveryRoutes.post("/api/delivery", (req: Request, res: Response) => {
  const delivery: Delivery = {
    id: `delivery-${db.deliveries.length + 1}`,
    status: Status.PENDING,
    ...req.body,
  };
  db.deliveries.push(delivery);
  return res.status(201).json(delivery);
});

deliveryRoutes.put("/api/delivery/:id", (req: Request, res: Response) => {
  const delivery = db.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ message: "Not found" });
  Object.assign(delivery, req.body);
  return res.status(200).json(delivery);
});

deliveryRoutes.delete("/api/delivery/:id", (req: Request, res: Response) => {
  const index = db.deliveries.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.deliveries.splice(index, 1);
  return res.status(200).json(removed);
});

export const deliveryPersonRoutes = Router();

deliveryPersonRoutes.get("/api/delivery-person", withCheck({ role: "ADMIN" }), (_req: Request, res: Response) => {
  return res.status(200).json({ deliveryPersonsList: db.deliveryPersons });
});

deliveryPersonRoutes.get("/api/delivery-person/near", (_req: Request, res: Response) => {
  return res.status(200).json({ deliveryPersonsList: db.deliveryPersons });
});

deliveryPersonRoutes.get("/api/delivery-person/near/user", (_req: Request, res: Response) => {
  return res.status(200).json({ deliveryPersonsList: db.deliveryPersons });
});

deliveryPersonRoutes.get("/api/delivery-person/by-user", withCheck({ role: "DELIVERY_PERSON" }), (req: Request, res: Response) => {
  const id = decodeToken(getTokenFromHeader(req) ?? "")?.id;
  const deliveryPerson = db.deliveryPersons.find((d) => d.id === id);
  if (!deliveryPerson) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(deliveryPerson);
});

deliveryPersonRoutes.get("/api/delivery-person/:id", (req: Request, res: Response) => {
  const deliveryPerson = db.deliveryPersons.find((d) => d.id === req.params.id);
  if (!deliveryPerson) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(deliveryPerson);
});

deliveryPersonRoutes.post("/api/delivery-person", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const deliveryPerson: DeliveryPerson = {
    id: `delivery-person-${db.deliveryPersons.length + 1}`,
    ...req.body,
  };
  db.deliveryPersons.push(deliveryPerson);
  return res.status(201).json(deliveryPerson);
});

deliveryPersonRoutes.put("/api/delivery-person/:id/location", withCheck({ role: ["DELIVERY_PERSON", "ADMIN"] }), (req: Request, res: Response) => {
  const deliveryPerson = db.deliveryPersons.find((d) => d.id === req.params.id);
  if (!deliveryPerson) return res.status(404).json({ message: "Not found" });
  Object.assign(deliveryPerson.address, req.body);
  return res.status(200).json(deliveryPerson);
});

deliveryPersonRoutes.put("/api/delivery-person/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const deliveryPerson = db.deliveryPersons.find((d) => d.id === req.params.id);
  if (!deliveryPerson) return res.status(404).json({ message: "Not found" });
  Object.assign(deliveryPerson, req.body);
  return res.status(200).json(deliveryPerson);
});

deliveryPersonRoutes.delete("/api/delivery-person/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const index = db.deliveryPersons.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.deliveryPersons.splice(index, 1);
  return res.status(200).json(removed);
});
