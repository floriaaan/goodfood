import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { withCheck } from "@mock/lib/auth";
import { Product, ProductType } from "@mock/types";

export const productRoutes = Router();

productRoutes.get("/api/product/type", (_req: Request, res: Response) => {
  return res.status(200).json(
    Object.entries(ProductType)
      .filter(([key]) => Number.isNaN(Number(key)))
      .map(([label, value]) => ({ label, value })),
  );
});

productRoutes.get("/api/product/by-restaurant/:id", (req: Request, res: Response) => {
  const list = db.products.filter((p) => p.restaurantId === req.params.id);
  return res.status(200).json({ productsList: list });
});

productRoutes.get("/api/product/ingredient-quantity/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  return res.status(200).json({ canMake: 42 });
});

productRoutes.get("/api/product/:id", (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(product);
});

productRoutes.post("/api/product", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const product: Product = {
    id: `product-${db.products.length + 1}`,
    categoriesList: [],
    allergensList: [],
    recipeList: [],
    ...req.body,
  };
  db.products.push(product);
  return res.status(201).json(product);
});

productRoutes.put("/api/product/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  Object.assign(product, req.body);
  return res.status(200).json(product);
});

productRoutes.post("/api/product/image", withCheck({ role: ["MANAGER", "ADMIN"] }), (_req: Request, res: Response) => {
  return res.status(200).json({ url: "https://loremflickr.com/640/480/food" });
});

productRoutes.delete("/api/product/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.products.splice(index, 1);
  return res.status(200).json(removed);
});

export const categoryRoutes = Router();

categoryRoutes.get("/api/category", (_req: Request, res: Response) => res.status(200).json({ categoriesList: db.categories }));

categoryRoutes.get("/api/category/:id", (req: Request, res: Response) => {
  const category = db.categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(category);
});

categoryRoutes.post("/api/category", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const category = { id: `category-${db.categories.length + 1}`, ...req.body };
  db.categories.push(category);
  return res.status(201).json(category);
});

categoryRoutes.put("/api/category/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const category = db.categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });
  Object.assign(category, req.body);
  return res.status(200).json(category);
});

categoryRoutes.delete("/api/category/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.categories.splice(index, 1);
  return res.status(200).json(removed);
});

export const allergenRoutes = Router();

allergenRoutes.get("/api/allergen", (_req: Request, res: Response) => res.status(200).json({ allergensList: db.allergens }));

allergenRoutes.get("/api/allergen/:id", (req: Request, res: Response) => {
  const allergen = db.allergens.find((a) => a.id === req.params.id);
  if (!allergen) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(allergen);
});

allergenRoutes.post("/api/allergen", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const allergen = { id: `allergen-${db.allergens.length + 1}`, ...req.body };
  db.allergens.push(allergen);
  return res.status(201).json(allergen);
});

allergenRoutes.put("/api/allergen/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const allergen = db.allergens.find((a) => a.id === req.params.id);
  if (!allergen) return res.status(404).json({ message: "Not found" });
  Object.assign(allergen, req.body);
  return res.status(200).json(allergen);
});

allergenRoutes.delete("/api/allergen/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  const index = db.allergens.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.allergens.splice(index, 1);
  return res.status(200).json(removed);
});
