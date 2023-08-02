import express, {Request, Response} from 'express';
import {categoryServiceClient} from '../../services/clients/product.client';
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {Category, CategoryId} from "@gateway/proto/product_pb";

export const categoryController = (app: express.Application) => {
    app.get('/api/category', (req: Request, res: Response) => {
        categoryServiceClient.getCategoryList(new Empty(), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/category/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const categoryId = new CategoryId().setId(id)

        categoryServiceClient.readCategory(categoryId, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.post('/api/category', (req: Request, res: Response) => {
        const {label, icon, hexaColor} = req.body;
        const category = new Category().setLibelle(label).setIcon(icon).setHexaColor(hexaColor)
        categoryServiceClient.createCategory(category, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.put('/api/category/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const {label, icon, hexaColor} = req.body;
        const category = new Category().setId(id).setLibelle(label).setIcon(icon).setHexaColor(hexaColor)
        categoryServiceClient.updateCategory(category, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.delete('/api/category/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        categoryServiceClient.deleteCategory(new CategoryId().setId(id), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
}