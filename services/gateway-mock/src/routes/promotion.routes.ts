import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Promotion } from "@mock/types";

export const promotionRoutes = Router();

promotionRoutes.get("/api/promotion/by-restaurant/:restaurantId", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const list = db.promotions.filter((p) => p.restaurantId === req.params.restaurantId);
  return res.status(200).json({ promotionsList: list });
});

promotionRoutes.get("/api/promotion", withCheck({ role: ["MANAGER", "ADMIN"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ promotionsList: db.promotions });
});

promotionRoutes.get("/api/promotion/:code", (req: Request, res: Response) => {
  const promotion = db.promotions.find((p) => p.id === req.params.code || p.code === req.params.code);
  if (!promotion) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(promotion);
});

promotionRoutes.post("/api/promotion", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const promotion: Promotion = { id: `promotion-${db.promotions.length + 1}`, ...req.body };
  db.promotions.push(promotion);
  return res.status(201).json(promotion);
});

promotionRoutes.put("/api/promotion/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const promotion = db.promotions.find((p) => p.id === req.params.id);
  if (!promotion) return res.status(404).json({ message: "Not found" });
  Object.assign(promotion, req.body);
  return res.status(200).json(promotion);
});

promotionRoutes.delete("/api/promotion/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.promotions.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.promotions.splice(index, 1);
  return res.status(200).json(removed);
});
