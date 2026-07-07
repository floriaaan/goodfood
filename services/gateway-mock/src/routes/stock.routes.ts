import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Ingredient, IngredientRestaurant, Supplier, SupplyOrder } from "@mock/types";

export const stockRoutes = Router();

// -- Suppliers --

stockRoutes.get("/api/stock/supplier", withCheck({ role: ["MANAGER", "ADMIN"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ suppliersList: db.suppliers });
});

stockRoutes.get("/api/stock/supplier/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplier = db.suppliers.find((s) => String(s.id) === req.params.id);
  if (!supplier) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(supplier);
});

stockRoutes.post("/api/stock/supplier", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplier: Supplier = { id: db.suppliers.length + 1, ...req.body };
  db.suppliers.push(supplier);
  return res.status(201).json(supplier);
});

stockRoutes.put("/api/stock/supplier/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplier = db.suppliers.find((s) => String(s.id) === req.params.id);
  if (!supplier) return res.status(404).json({ message: "Not found" });
  Object.assign(supplier, req.body);
  return res.status(200).json(supplier);
});

stockRoutes.delete("/api/stock/supplier/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.suppliers.findIndex((s) => String(s.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.suppliers.splice(index, 1);
  return res.status(200).json(removed);
});

// -- Ingredients --

stockRoutes.get("/api/stock/ingredient", withCheck({ role: ["MANAGER", "ADMIN"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ ingredientsList: db.ingredients });
});

stockRoutes.post("/api/stock/ingredient", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredient: Ingredient = { id: db.ingredients.length + 1, description: null, ...req.body };
  db.ingredients.push(ingredient);
  return res.status(201).json(ingredient);
});

stockRoutes.get("/api/stock/ingredient/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredient = db.ingredients.find((i) => String(i.id) === req.params.id);
  if (!ingredient) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(ingredient);
});

stockRoutes.put("/api/stock/ingredient/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredient = db.ingredients.find((i) => String(i.id) === req.params.id);
  if (!ingredient) return res.status(404).json({ message: "Not found" });
  Object.assign(ingredient, req.body);
  return res.status(200).json(ingredient);
});

stockRoutes.delete("/api/stock/ingredient/:id", withCheck({ role: ["ADMIN"] }), (req: Request, res: Response) => {
  const index = db.ingredients.findIndex((i) => String(i.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.ingredients.splice(index, 1);
  return res.status(200).json(removed);
});

// -- Ingredient x Restaurant (stock levels) --

stockRoutes.get(
  "/api/stock/ingredient/restaurant/by-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    const list = db.ingredientRestaurants.filter((ir) => ir.restaurantId === req.params.id);
    return res.status(200).json({ ingredientRestaurantsList: list });
  },
);

stockRoutes.get(
  "/api/stock/ingredient/restaurant/by-product/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    const list = db.ingredientRestaurants.filter((ir) => ir.inProductListList.includes(req.params.id));
    return res.status(200).json({ ingredientRestaurantsList: list });
  },
);

stockRoutes.get("/api/stock/ingredient/restaurant", withCheck({ role: ["MANAGER", "ADMIN"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ ingredientRestaurantsList: db.ingredientRestaurants });
});

stockRoutes.post("/api/stock/ingredient/restaurant", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredientRestaurant: IngredientRestaurant = {
    id: db.ingredientRestaurants.length + 1,
    inProductListList: [],
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.ingredientRestaurants.push(ingredientRestaurant);
  return res.status(201).json(ingredientRestaurant);
});

stockRoutes.get("/api/stock/ingredient/restaurant/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredientRestaurant = db.ingredientRestaurants.find((ir) => String(ir.id) === req.params.id);
  if (!ingredientRestaurant) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(ingredientRestaurant);
});

stockRoutes.put("/api/stock/ingredient/restaurant/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const ingredientRestaurant = db.ingredientRestaurants.find((ir) => String(ir.id) === req.params.id);
  if (!ingredientRestaurant) return res.status(404).json({ message: "Not found" });
  Object.assign(ingredientRestaurant, req.body, { updatedAt: new Date().toISOString() });
  return res.status(200).json(ingredientRestaurant);
});

stockRoutes.delete("/api/stock/ingredient/restaurant/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.ingredientRestaurants.findIndex((ir) => String(ir.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.ingredientRestaurants.splice(index, 1);
  return res.status(200).json(removed);
});

// -- Supply orders --

stockRoutes.get(
  "/api/stock/supply/order/by-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    const restaurantIrIds = db.ingredientRestaurants.filter((ir) => ir.restaurantId === req.params.id).map((ir) => ir.id);
    const list = db.supplyOrders.filter((so) => restaurantIrIds.includes(so.ingredientRestaurantId));
    return res.status(200).json({ supplyOrdersList: list });
  },
);

stockRoutes.get(
  "/api/stock/supply/order/by-supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    const list = db.supplyOrders.filter((so) => String(so.supplierId) === req.params.id);
    return res.status(200).json({ supplyOrdersList: list });
  },
);

stockRoutes.get(
  "/api/stock/supply/order/by-ingredient-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    const list = db.supplyOrders.filter((so) => String(so.ingredientRestaurantId) === req.params.id);
    return res.status(200).json({ supplyOrdersList: list });
  },
);

stockRoutes.post("/api/stock/supply/order", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplyOrder: SupplyOrder = {
    id: db.supplyOrders.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.supplyOrders.push(supplyOrder);
  return res.status(201).json(supplyOrder);
});

stockRoutes.get("/api/stock/supply/order/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplyOrder = db.supplyOrders.find((so) => String(so.id) === req.params.id);
  if (!supplyOrder) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(supplyOrder);
});

stockRoutes.put("/api/stock/supply/order/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const supplyOrder = db.supplyOrders.find((so) => String(so.id) === req.params.id);
  if (!supplyOrder) return res.status(404).json({ message: "Not found" });
  Object.assign(supplyOrder, req.body, { updatedAt: new Date().toISOString() });
  return res.status(200).json(supplyOrder);
});

stockRoutes.delete("/api/stock/supply/order/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.supplyOrders.findIndex((so) => String(so.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.supplyOrders.splice(index, 1);
  return res.status(200).json(removed);
});

export const stockPersonRoutes = Router();

stockPersonRoutes.post("/api/stock/outcomes/by-restaurant/:id", (req: Request, res: Response) => {
  const list = db.ingredientRestaurants.filter((ir) => ir.restaurantId === req.params.id);
  return res.status(200).json({ outcomesList: list });
});
