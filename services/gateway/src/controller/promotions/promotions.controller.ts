import {Application} from "express";
import {promotionsServiceClient} from "@gateway/services/clients/promotions.client";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {Promotion, PromotionCode, PromotionCreateInput, PromotionId, RestaurantId} from "@gateway/proto/promotions_pb";

export const promotionsController = (app: Application) => {
    app.get('/api/promotions/:code', (req, res) => {
        const {code} = req.params;
        promotionsServiceClient.getPromotion(new PromotionCode().setCode(code), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/promotions', (req, res) => {
        promotionsServiceClient.getPromotions(new Empty(), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/promotions/by-restaurant/:restaurantId', (req, res) => {
        const {restaurantId} = req.params;
        promotionsServiceClient.getPromotionsByRestaurant(new RestaurantId().setId(restaurantId), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.post('/api/promotions', (req, res) => {
        const {code, reduction, method, restaurantId} = req.body;
        const promotionCreateInput = new PromotionCreateInput().setCode(code)
            .setReduction(reduction)
            .setMethod(method)
            .setRestaurantId(restaurantId);
        promotionsServiceClient.createPromotion(promotionCreateInput, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.put('/api/promotions/:id', (req, res) => {
        const {id} = req.params;
        const {code, reduction, method, restaurantId} = req.body;
        const promotionUpdateInput = new Promotion().setId(id).setCode(code)
            .setReduction(reduction)
            .setMethod(method)
            .setRestaurantId(restaurantId);

        promotionsServiceClient.createPromotion(promotionUpdateInput, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.delete('/api/promotions/:id', (req, res) => {
        const {id} = req.params;

        promotionsServiceClient.deletePromotion(new PromotionId().setId(id), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
};