import {Request, Response, Router} from 'express';
import {allergenServiceClient} from '../../services/clients/product.client';
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {Allergen, AllergenId} from "@gateway/proto/product_pb";

export const allergenRoutes = Router();

allergenRoutes.get('/api/allergen', (req: Request, res: Response) => {
    allergenServiceClient.getAllergenList(new Empty(), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

allergenRoutes.get('/api/allergen/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const allergenId = new AllergenId().setId(id)

    allergenServiceClient.readAllergen(allergenId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

allergenRoutes.post('/api/allergen', (req: Request, res: Response) => {
    const {label} = req.body;
    const allergen = new Allergen().setLibelle(label);
    allergenServiceClient.createAllergen(allergen, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

allergenRoutes.put('/api/allergen/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const {label} = req.body;
    const allergen = new Allergen().setId(id).setLibelle(label);
    allergenServiceClient.updateAllergen(allergen, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

allergenRoutes.delete('/api/allergen/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    allergenServiceClient.deleteAllergen(new AllergenId().setId(id), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});