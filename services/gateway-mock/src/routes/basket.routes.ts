import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { decodeToken, getTokenFromHeader } from "@mock/lib/auth";
import { Basket } from "@mock/types";

export const basketRoutes = Router();

const emptyBasket = (userId: string): Basket => ({ userId, productsList: [], restaurantId: "" });

const authedUserId = (req: Request): string | undefined => decodeToken(getTokenFromHeader(req) ?? "")?.id;

basketRoutes.get("/api/basket/", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  return res.status(200).json(db.baskets.get(userId) ?? emptyBasket(userId));
});

basketRoutes.post("/api/basket", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { productId, quantity, restaurantId } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });

  const basket = db.baskets.get(userId) ?? emptyBasket(userId);
  if (restaurantId) basket.restaurantId = restaurantId;
  const existing = basket.productsList.find((p) => p.id === productId);
  if (existing) existing.quantity += quantity;
  else basket.productsList.push({ id: productId, quantity });

  db.baskets.set(userId, basket);
  return res.status(200).json(basket);
});

basketRoutes.put("/api/basket/remove", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { productId, quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });

  const basket = db.baskets.get(userId) ?? emptyBasket(userId);
  const existing = basket.productsList.find((p) => p.id === productId);
  if (existing) {
    existing.quantity -= quantity;
    if (existing.quantity <= 0) basket.productsList = basket.productsList.filter((p) => p.id !== productId);
  }

  db.baskets.set(userId, basket);
  return res.status(200).json(basket);
});

basketRoutes.put("/api/basket/restaurant", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const basket = db.baskets.get(userId) ?? emptyBasket(userId);
  basket.restaurantId = req.body.restaurantId;
  db.baskets.set(userId, basket);
  return res.status(200).json(basket);
});

basketRoutes.post("/api/basket/reset", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const basket = emptyBasket(userId);
  db.baskets.set(userId, basket);
  return res.status(200).json(basket);
});

basketRoutes.post("/api/basket/save", (req: Request, res: Response) => {
  const userId = authedUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { basket } = req.body;
  if (!basket) return res.status(400).json({ message: "Basket is required" });

  db.baskets.set(userId, { ...basket, userId });
  return res.status(200).json(db.baskets.get(userId));
});
