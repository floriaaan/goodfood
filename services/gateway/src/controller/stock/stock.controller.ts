import { Request, Response, Router } from "express";
import { stockServiceClient } from "../../services/clients/stock.client";
import {
  CreateIngredientRequest,
  CreateIngredientRestaurantRequest,
  CreateSupplierRequest,
  CreateSupplyOrderRequest,
  DeleteIngredientRequest,
  DeleteIngredientRestaurantRequest,
  DeleteSupplierRequest,
  DeleteSupplyOrderRequest,
  GetIngredientRequest,
  GetIngredientRestaurantRequest,
  GetIngredientRestaurantsByProductRequest,
  GetIngredientRestaurantsByRestaurantRequest,
  GetSupplierRequest,
  GetSupplyOrderRequest,
  GetSupplyOrdersByIngredientRestaurantRequest,
  GetSupplyOrdersByRestaurantRequest,
  GetSupplyOrdersBySupplierRequest,
  IngredientRestaurant,
  SupplyOrder,
  UpdateIngredientRequest,
  UpdateIngredientRestaurantRequest,
  UpdateSupplierRequest,
  UpdateSupplyOrderRequest,
} from "@gateway/proto/stock_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { check, withCheck } from "@gateway/middleware/auth";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";
import { Restaurant, RestaurantId } from "@gateway/proto/restaurant_pb";

export const stockRoutes = Router();
/**
 * Ingredient Routes
 */

stockRoutes.get(
  "/api/stock/supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
    const { id } = req.params;
    const supplierRequest = new GetSupplierRequest().setId(Number(id));

    stockServiceClient.getSupplier(supplierRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.get("/api/stock/supplier", withCheck({ role: ["MANAGER", "ADMIN"] }), (_: Request, res: Response) => {
  /*    #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
  stockServiceClient.getSuppliers(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

stockRoutes.get(
  "/api/stock/ingredient/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*    #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { id } = req.params;
    const ingredientRequest = new GetIngredientRequest().setId(Number(id));

    stockServiceClient.getIngredient(ingredientRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.get("/api/stock/ingredient", withCheck({ role: ["MANAGER", "ADMIN"] }), (_: Request, res: Response) => {
  /*    #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
  stockServiceClient.getIngredients(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

stockRoutes.post(
  "/api/stock/ingredient",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "ingredient-name",
                description: "ingredient-desc",
            }
        } 
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { name, description } = req.body;
    const ingredientRequest = new CreateIngredientRequest().setName(name).setDescription(description);

    stockServiceClient.createIngredient(ingredientRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(201).json(response.toObject());
    });
  },
);

stockRoutes.put(
  "/api/stock/ingredient/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "ingredient-name",
                description: "ingredient-desc",
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
      */
    const { id } = req.params;
    const { name, description } = req.body;
    const ingredientRequest = new UpdateIngredientRequest().setId(Number(id)).setName(name).setDescription(description);

    stockServiceClient.updateIngredient(ingredientRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.delete("/api/stock/ingredient/:id", withCheck({ role: ["ADMIN"] }), (req: Request, res: Response) => {
  /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
  const { id } = req.params;
  const ingredientRequest = new DeleteIngredientRequest().setId(Number(id));

  stockServiceClient.deleteIngredient(ingredientRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

/**
 * Ingredient Restaurant Routes
 */

stockRoutes.get(
  "/api/stock/ingredient/restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    const { id } = req.params;
    const ingredientRestaurantRequest = new GetIngredientRestaurantRequest().setId(Number(id));

    try {
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(ingredientRestaurantRequest, (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });

      return res.status(200).json(ingredient_restaurant);
    } catch (error) {
      return res.status(500).send({ error });
    }
  },
);

stockRoutes.get(
  "/api/stock/ingredient/restaurant/by-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */

    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    const { id } = req.params;
    const ingredientRestaurantsByRestaurantRequest = new GetIngredientRestaurantsByRestaurantRequest().setRestaurantId(
      id,
    );

    try {
      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.getIngredientRestaurantsByRestaurant(
      ingredientRestaurantsByRestaurantRequest,
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

stockRoutes.get(
  "/api/stock/ingredient/restaurant/by-product/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { id } = req.params;
    const ingredientRestaurantsByProductRequest = new GetIngredientRestaurantsByProductRequest().setProductId(id);

    stockServiceClient.getIngredientRestaurantsByProduct(ingredientRestaurantsByProductRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.post(
  "/api/stock/ingredient/restaurant",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                alertThreshold: 5,
                quantity: 2,
                productList: ["product_id:1", "product_id:2"],
                unitPrice: 2,
                pricePerKilo: 1.5,
                restaurantId: "restaurant_id:1",
                ingredientId: 1,
                supplierId: 1,
            }
        } 
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    const { alertThreshold, quantity, productList, unitPrice, pricePerKilo, restaurantId, ingredientId, supplierId } = req.body;
    const ingredientRestaurant = new CreateIngredientRestaurantRequest()
      .setAlertThreshold(alertThreshold)
      .setQuantity(quantity)
      .setInProductListList(productList)
      .setUnitPrice(unitPrice)
      .setPricePerKilo(pricePerKilo)
      .setRestaurantId(restaurantId)
      .setIngredientId(ingredientId)
      .setSupplierId(Number(supplierId));

    try {
      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(new RestaurantId().setId(restaurantId), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.createIngredientRestaurant(ingredientRestaurant, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(201).json(response.toObject());
    });
  },
);

stockRoutes.put(
  "/api/stock/ingredient/restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          alertThreshold: 5,
          quantity: 2,
          productList: ["product_id:1", "product_id:2"],
          unitPrice: 2,
          pricePerKilo: 1.5,
          restaurantId: "restaurant_id:1",
          ingredientId: 1,
          supplierId: 1,
        }
      }
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    const { id } = req.params;
    const { alertThreshold, quantity, productList, unitPrice, pricePerKilo, restaurantId, ingredientId, supplierId } = req.body;
    const ingredientRestaurant = new UpdateIngredientRestaurantRequest()
      .setId(Number(id))
      .setAlertThreshold(alertThreshold)
      .setQuantity(quantity)
      .setInProductListList(productList)
      .setUnitPrice(unitPrice)
      .setPricePerKilo(pricePerKilo)
      .setRestaurantId(restaurantId)
      .setIngredientId(ingredientId)
      .setSupplierId(Number(supplierId));

    try {
      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(new RestaurantId().setId(restaurantId), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.updateIngredientRestaurant(ingredientRestaurant, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.delete(
  "/api/stock/ingredient/restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    const { id } = req.params;

    try {
      // todo: refactor this into a getter
      const ingredientRestaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(Number(id)),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredientRestaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.deleteIngredientRestaurant(
      new DeleteIngredientRestaurantRequest().setId(Number(id)),
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

/**
 * Supplier Routes
 */

stockRoutes.get(
  "/api/stock/supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { id } = req.params;

    stockServiceClient.getSupplier(new GetSupplierRequest().setId(Number(id)), (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.get("/api/stock/supplier", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  /*    #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
    */
  stockServiceClient.getSuppliers(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

stockRoutes.post("/api/stock/supplier", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  /*    #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "supplier-name",
                contact: "supplier-contact"
            }
        } 
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
  const { name, contact } = req.body;
  const supplierRequest = new CreateSupplierRequest().setName(name).setContact(contact);

  stockServiceClient.createSupplier(supplierRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

stockRoutes.put(
  "/api/stock/supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "supplier-name",
                contact: "supplier-contact"
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
      */
    const { id } = req.params;
    const { name, contact } = req.body;
    const supplierRequest = new UpdateSupplierRequest().setId(Number(id)).setName(name).setContact(contact);

    stockServiceClient.updateSupplier(supplierRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.delete(
  "/api/stock/supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { id } = req.params;

    stockServiceClient.deleteSupplier(new DeleteSupplierRequest().setId(Number(id)), (error, response) => {
      if (error) {
        res.status(500).send({ error: error.message });
      } else {
        res.json(response.toObject());
      }
    });
  },
);

/**
 * Supply Order Routes
 */

stockRoutes.get(
  "/api/stock/supply/order/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    const { id } = req.params;

    try {
      // todo: refactor this into a getter
      const supplyOrder: SupplyOrder.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getSupplyOrder(new GetSupplyOrderRequest().setId(Number(id)), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      // todo: WARN - supplyOrder support only one product by one product so it work for now
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(supplyOrder.ingredientRestaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });

      return res.status(200).json(supplyOrder);
    } catch (error) {
      return res.status(500).send({ error });
    }
  },
);

stockRoutes.get(
  "/api/stock/supply/order/by-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    const { id } = req.params;

    try {
      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.getSupplyOrdersByRestaurant(
      new GetSupplyOrdersByRestaurantRequest().setRestaurantId(id),
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

stockRoutes.get(
  "/api/stock/supply/order/by-supplier/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    const { id } = req.params;
    stockServiceClient.getSupplyOrdersBySupplier(
      new GetSupplyOrdersBySupplierRequest().setSupplierId(Number(id)),
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

stockRoutes.get(
  "/api/stock/supply/order/by-ingredient-restaurant/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    try {
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(Number(req.params.id)),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    const { id } = req.params;
    stockServiceClient.getSupplyOrdersByIngredientRestaurant(
      new GetSupplyOrdersByIngredientRestaurantRequest().setIngredientRestaurantId(Number(id)),
      (error, response) => {
        if (error) return res.status(500).send({ error });
        else return res.status(200).json(response.toObject());
      },
    );
  },
);

stockRoutes.post(
  "/api/stock/supply/order",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                quantity: 3,
                ingredientRestaurantId: 1,
                supplierId: 1
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
      */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    const { quantity, ingredientRestaurantId, supplierId } = req.body;
    const supplyOrderRequest = new CreateSupplyOrderRequest()
      .setQuantity(quantity)
      .setIngredientRestaurantId(ingredientRestaurantId)
      .setSupplierId(supplierId);

    try {
      // todo: WARN - supplyOrder support only one product by one product so it work for now
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(ingredientRestaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    stockServiceClient.createSupplyOrder(supplyOrderRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(201).json(response.toObject());
    });
  },
);

stockRoutes.put(
  "/api/stock/supply/order/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /*  #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                quantity: 3,
                ingredientRestaurantId: 1,
                supplierId: 1
            }
        } 
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    try {
      // todo: refactor this into a getter
      const supplyOrder: SupplyOrder.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getSupplyOrder(new GetSupplyOrderRequest().setId(Number(id)), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      // todo: WARN - supplyOrder support only one product by one product so it work for now
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(supplyOrder.ingredientRestaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }

    const { id } = req.params;
    const { quantity, ingredientRestaurantId, supplierId } = req.body;
    const supplyOrderRequest = new UpdateSupplyOrderRequest()
      .setId(Number(id))
      .setQuantity(quantity)
      .setIngredientRestaurantId(ingredientRestaurantId)
      .setSupplierId(supplierId);

    stockServiceClient.updateSupplyOrder(supplyOrderRequest, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

stockRoutes.delete(
  "/api/stock/supply/order/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        }
     */
    // Auth check and :id check ---
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.split("Bearer ")[1];
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------

    const { id } = req.params;

    try {
      // todo: refactor this into a getter
      const supplyOrder: SupplyOrder.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getSupplyOrder(new GetSupplyOrderRequest().setId(Number(id)), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      });

      // todo: WARN - supplyOrder support only one product by one product so it work for now
      // todo: refactor this into a getter
      const ingredient_restaurant: IngredientRestaurant.AsObject = await new Promise((resolve, reject) => {
        stockServiceClient.getIngredientRestaurant(
          new GetIngredientRestaurantRequest().setId(supplyOrder.ingredientRestaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      // todo: refactor this into a getter
      const restaurant: Restaurant.AsObject = await new Promise((resolve, reject) => {
        restaurantServiceClient.getRestaurant(
          new RestaurantId().setId(ingredient_restaurant.restaurantId),
          (error, response) => {
            if (error) reject(error);
            else resolve(response.toObject());
          },
        );
      });

      if (!(await check(token, { role: "ADMIN" })) && !restaurant.useridsList.includes(userId.toString()))
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(500).send({ error });
    }
    stockServiceClient.deleteSupplyOrder(new DeleteSupplyOrderRequest().setId(Number(id)), (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);
