import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Restaurant } from "@mock/types";

export const restaurantRoutes = Router();

restaurantRoutes.get("/api/restaurant", (_req: Request, res: Response) => {
  return res.status(200).json({ restaurantsList: db.restaurants });
});

restaurantRoutes.post("/api/restaurant/by-location", (_req: Request, res: Response) => {
  // Distance to the requested location isn't modeled; return every restaurant "nearby".
  return res.status(200).json({ restaurantsList: db.restaurants });
});

restaurantRoutes.get("/api/restaurant/:id/users", (req: Request, res: Response) => {
  const restaurant = db.restaurants.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });
  const staff = db.users.filter((u) => restaurant.useridsList.includes(u.id));
  return res.status(200).json({ usersList: staff });
});

restaurantRoutes.get("/api/restaurant/:id", (req: Request, res: Response) => {
  const restaurant = db.restaurants.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(restaurant);
});

restaurantRoutes.post("/api/restaurant", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const restaurant: Restaurant = {
    id: `restaurant-${db.restaurants.length + 1}`,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
    openinghoursList: [],
    useridsList: [],
    ...req.body,
  };
  db.restaurants.push(restaurant);
  return res.status(201).json(restaurant);
});

restaurantRoutes.put("/api/restaurant/:id", withCheck({ role: ["ADMIN", "MANAGER"] }), (req: Request, res: Response) => {
  const restaurant = db.restaurants.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });
  Object.assign(restaurant, req.body, { updatedat: new Date().toISOString() });
  return res.status(200).json(restaurant);
});

restaurantRoutes.delete("/api/restaurant/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const index = db.restaurants.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.restaurants.splice(index, 1);
  return res.status(200).json(removed);
});
