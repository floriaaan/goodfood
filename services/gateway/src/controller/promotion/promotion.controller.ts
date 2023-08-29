import { Router } from "express";
import { promotionServiceClient } from "@gateway/services/clients/promotion.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import {
  Method,
  Promotion,
  PromotionCode,
  PromotionCreateInput,
  PromotionId,
  RestaurantId,
} from "@gateway/proto/promotions_pb";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { withCheck } from "@gateway/middleware/auth";

export const promotionRoutes = Router();

promotionRoutes.get("/api/promotion/:code", async (req, res) => {
  /* #swagger.parameters['code'] = {
           in: 'path',
           required: true,
           type: 'string'
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
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------
  const { code } = req.params;
  promotionServiceClient.getPromotion(new PromotionCode().setCode(code), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

promotionRoutes.get("/api/promotion", withCheck({ role: ["MANAGER", "ADMIN"] }), (_, res) => {
  promotionServiceClient.getPromotions(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

promotionRoutes.get(
  "/api/promotion/by-restaurant/:restaurantId",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  async (req, res) => {
    /* #swagger.parameters['restaurantId'] = {
           in: 'path',
           required: true,
           type: 'string'
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
    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // ----------------------------
    /* #swagger.parameters['restaurantId'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
    const { restaurantId } = req.params;
    promotionServiceClient.getPromotionsByRestaurant(new RestaurantId().setId(restaurantId), (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

promotionRoutes.post("/api/promotion", withCheck({ role: ["MANAGER", "ADMIN"] }), (req, res) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                code: "code-example",
                reduction: "reduction-example",
                method: {'$ref': '#/definitions/Method'},
                restaurantId: "restaurant_id:0",
            }
    } #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { code, reduction, method: inputMethod, restaurantId } = req.body;
  const method = Method[inputMethod] as unknown as Method;
  if (!method) return res.status(400).json({ message: "Invalid method" });

  const promotionCreateInput = new PromotionCreateInput()
    .setCode(code)
    .setReduction(reduction)
    .setMethod(method)
    .setRestaurantId(restaurantId);
  promotionServiceClient.createPromotion(promotionCreateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

promotionRoutes.put("/api/promotion/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req, res) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                code: "code-example",
                reduction: "reduction-example",
                method: {'$ref': '#/definitions/Method'},
                restaurantId: "restaurant_id:0",
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
  const { id } = req.params;
  const { code, reduction, method: inputMethod, restaurantId } = req.body;
  const method = Method[inputMethod] as unknown as Method;
  if (!method) return res.status(400).json({ message: "Invalid method" });

  const promotionUpdateInput = new Promotion()
    .setId(id)
    .setCode(code)
    .setReduction(reduction)
    .setMethod(method)
    .setRestaurantId(restaurantId);

  promotionServiceClient.updatePromotion(promotionUpdateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

promotionRoutes.delete("/api/promotion/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req, res) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['id'] = {
       in: 'path',
       required: true,
       type: 'string'
    } */
  const { id } = req.params;

  promotionServiceClient.deletePromotion(new PromotionId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
