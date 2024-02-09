import { Request, Response, Router } from "express";
import {
  AddProductRequest,
  BasketRequest,
  RemoveProductRequest,
  UpdateRestaurantRequest,
  UserIdRequest,
} from "@gateway/proto/basket_pb";
import { basketServiceClient } from "@gateway/services/clients/basket.client";
import { getUserIdFromToken } from "@gateway/services/user.service";

export const basketRoutes = Router();

basketRoutes.get("/api/basket/", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  basketServiceClient.getBasket(new UserIdRequest().setUserId(userId), (error, response) => {
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
                quantity: 0,
            }
    }
      #swagger.parameters['body'] = {
            in: 'body',
            required: false,
            schema: {
                restaurantId:"restaurant_id:0"
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { productId, quantity, restaurantId } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });
  const request = new AddProductRequest().setUserId(userId).setProductId(productId).setQuantity(quantity);
  if (restaurantId) request.setRestaurantId(restaurantId);

  basketServiceClient.addProduct(request, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

basketRoutes.put("/api/basket/remove", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                productId: "product_id:0",
                quantity: 0,
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { productId, quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });

  const request = new RemoveProductRequest().setUserId(userId).setProductId(productId).setQuantity(quantity);
  basketServiceClient.removeProduct(request, (error, response) => {
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
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { restaurantId } = req.body;
  basketServiceClient.updateRestaurant(
    new UpdateRestaurantRequest().setRestaurantId(restaurantId).setUserId(userId),
    (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    },
  );
});

basketRoutes.post("/api/basket/reset", async (req: Request, res: Response) => {
  /*  #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  basketServiceClient.reset(new UserIdRequest().setUserId(userId), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

basketRoutes.post("/api/basket/save", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = (await getUserIdFromToken(token)) /* TODO: remove */ as unknown as string;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { basket } = req.body;
  if (!basket) return res.status(400).json({ message: "Basket is required" });

  basketServiceClient.saveBasket(new BasketRequest().setUserId(userId).setBasket(basket), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
