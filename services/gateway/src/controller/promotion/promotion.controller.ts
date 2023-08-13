import {Router} from "express";
import {promotionServiceClient} from "@gateway/services/clients/promotion.client";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {Promotion, PromotionCode, PromotionCreateInput, PromotionId, RestaurantId} from "@gateway/proto/promotions_pb";

export const promotionRoutes = Router();

promotionRoutes.get('/api/promotion/:code', (req, res) => {
    const {code} = req.params;
    promotionServiceClient.getPromotion(new PromotionCode().setCode(code), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

promotionRoutes.get('/api/promotion', (req, res) => {
    promotionServiceClient.getPromotions(new Empty(), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

promotionRoutes.get('/api/promotion/by-restaurant/:restaurantId', (req, res) => {
    const {restaurantId} = req.params;
    promotionServiceClient.getPromotionsByRestaurant(new RestaurantId().setId(restaurantId), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

promotionRoutes.post('/api/promotion', (req, res) => {
    const {code, reduction, method, restaurantId} = req.body;
    const promotionCreateInput = new PromotionCreateInput().setCode(code)
        .setReduction(reduction)
        .setMethod(method)
        .setRestaurantId(restaurantId);
    promotionServiceClient.createPromotion(promotionCreateInput, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

promotionRoutes.put('/api/promotion/:id', (req, res) => {
    const {id} = req.params;
    const {code, reduction, method, restaurantId} = req.body;
    const promotionUpdateInput = new Promotion().setId(id).setCode(code)
        .setReduction(reduction)
        .setMethod(method)
        .setRestaurantId(restaurantId);

    promotionServiceClient.createPromotion(promotionUpdateInput, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

promotionRoutes.delete('/api/promotion/:id', (req, res) => {
    const {id} = req.params;

    promotionServiceClient.deletePromotion(new PromotionId().setId(id), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});