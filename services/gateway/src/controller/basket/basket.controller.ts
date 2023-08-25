import { Request, Response, Router } from "express";
import { ProductRequest, RestaurantRequest, UserId } from "@gateway/proto/basket_pb";
import { basketServiceClient } from "@gateway/services/clients/basket.client";
import { getUserIdFromToken } from "@gateway/services/user.service";

export const basketRoutes = Router();

basketRoutes.get("/api/basket/", async (req: Request, res: Response) => {
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  basketServiceClient.getBasket(new UserId().setId(Number(userId)), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

basketRoutes.post("/api/basket", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                productId: "product_id:0",
                restaurantId:"restaurant_id:0"
            }
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { productId, restaurantId } = req.body;
  const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
  basketServiceClient.addProduct(basketRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

basketRoutes.put("/api/basket/remove-product", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                productId: "product_id:0",
                restaurantId:"restaurant_id:0"
            }
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { productId, restaurantId } = req.body;

  const basketRequest = new ProductRequest().setUserId(userId).setProductId(productId).setRestaurantId(restaurantId);
  basketServiceClient.deleteProduct(basketRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

basketRoutes.put("/api/basket/restaurant", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                restaurantId:"restaurant_id:0"
            }
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { restaurantId } = req.body;
  basketServiceClient.updateRestaurant(
    new RestaurantRequest().setRestaurantId(restaurantId).setUserId(userId),
    (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    },
  );
});

basketRoutes.post("/api/basket/reset", async (req: Request, res: Response) => {
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  basketServiceClient.reset(new UserId().setId(userId), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
