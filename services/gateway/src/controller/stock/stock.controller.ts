import {Request, Response, Router} from 'express';
import {stockServiceClient} from '../../services/clients/stock.client';
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
    UpdateIngredientRequest,
    UpdateIngredientRestaurantRequest,
    UpdateSupplierRequest,
    UpdateSupplyOrderRequest
} from "@gateway/proto/stock_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";


export const stockRoutes = Router();
/**
 * Ingredient Routes
 */

stockRoutes.get('/api/stock/supplier/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const supplierRequest = new GetSupplierRequest().setId(Number(id));

    stockServiceClient.getSupplier(supplierRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/supplier', (req: Request, res: Response) => {

    stockServiceClient.getSuppliers(new Empty(), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/ingredient/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const ingredientRequest = new GetIngredientRequest().setId(Number(id));

    stockServiceClient.getIngredient(ingredientRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/ingredient', (req: Request, res: Response) => {

    stockServiceClient.getIngredients(new Empty(), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.post('/api/stock/ingredient', (req: Request, res: Response) => {
    const {name, desciption} = req.body
    const ingredientRequest = new CreateIngredientRequest().setName(name).setDescription(desciption)

    stockServiceClient.createIngredient(ingredientRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.put('/api/stock/ingredient/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const {name, desciption} = req.body
    const ingredientRequest = new UpdateIngredientRequest().setId(Number(id)).setName(name).setDescription(desciption)

    stockServiceClient.updateIngredient(ingredientRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.delete('/api/stock/ingredient/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const ingredientRequest = new DeleteIngredientRequest().setId(Number(id));

    stockServiceClient.deleteIngredient(ingredientRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.delete('/api/stock/ingredient/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const ingredientRequest = new DeleteIngredientRequest().setId(Number(id));

    stockServiceClient.deleteIngredient(ingredientRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

/**
 * Ingredient Restaurant Routes
 */

stockRoutes.get('/api/stock/ingredient/restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const ingredientRestaurantRequest = new GetIngredientRestaurantRequest().setId(Number(id));

    stockServiceClient.getIngredientRestaurant(ingredientRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/ingredient/restaurant/by-restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const ingredientRestaurantsByRestaurantRequest = new GetIngredientRestaurantsByRestaurantRequest().setRestaurantId(id);

    stockServiceClient.getIngredientRestaurantsByRestaurant(ingredientRestaurantsByRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/ingredient/restaurant/by-product/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const ingredientRestaurantsByProductRequest = new GetIngredientRestaurantsByProductRequest().setProductId(id);

    stockServiceClient.getIngredientRestaurantsByProduct(ingredientRestaurantsByProductRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.post('/api/stock/ingredient/restaurant', (req: Request, res: Response) => {
    const {alertThreshold, quantity, productList, unitPrice, pricePerKilo, restaurantId, ingredientId} = req.body;
    const ingredientRestaurant = new CreateIngredientRestaurantRequest().setAlertThreshold(alertThreshold)
        .setQuantity(quantity)
        .setInProductListList(productList)
        .setUnitPrice(unitPrice)
        .setPricePerKilo(pricePerKilo)
        .setRestaurantId(restaurantId)
        .setIngredientId(ingredientId)


    stockServiceClient.createIngredientRestaurant(ingredientRestaurant, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.put('/api/stock/ingredient/restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const {alertThreshold, quantity, productList, unitPrice, pricePerKilo, restaurantId, ingredientId} = req.body;
    const ingredientRestaurant = new UpdateIngredientRestaurantRequest().setId(Number(id)).setAlertThreshold(alertThreshold)
        .setQuantity(quantity)
        .setInProductListList(productList)
        .setUnitPrice(unitPrice)
        .setPricePerKilo(pricePerKilo)
        .setRestaurantId(restaurantId)
        .setIngredientId(ingredientId)


    stockServiceClient.updateIngredientRestaurant(ingredientRestaurant, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.delete('/api/stock/ingredient/restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    stockServiceClient.deleteIngredientRestaurant(new DeleteIngredientRestaurantRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

/**
 * Supplier Routes
 */

stockRoutes.get('/api/stock/supplier/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    stockServiceClient.getSupplier(new GetSupplierRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/supplier', (req: Request, res: Response) => {
    stockServiceClient.getSuppliers(new Empty(), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.post('/api/stock/supplier', (req: Request, res: Response) => {
    const {name, contact} = req.body;
    const supplierRequest = new CreateSupplierRequest().setName(name).setContact(contact)

    stockServiceClient.createSupplier(supplierRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.put('/api/stock/supplier/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, contact} = req.body;
    const supplierRequest = new UpdateSupplierRequest().setId(Number(id)).setName(name).setContact(contact)

    stockServiceClient.updateSupplier(supplierRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.delete('/api/stock/supplier/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    stockServiceClient.deleteSupplier(new DeleteSupplierRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

/**
 * Supply Order Routes
 */

stockRoutes.get('/api/stock/supply/order/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    stockServiceClient.getSupplyOrder(new GetSupplyOrderRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/supply/order/by-restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    stockServiceClient.getSupplyOrdersByRestaurant(new GetSupplyOrdersByRestaurantRequest().setRestaurantId(id), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/supply/order/by-supplier/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    stockServiceClient.getSupplyOrdersBySupplier(new GetSupplyOrdersBySupplierRequest().setSupplierId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.get('/api/stock/supply/order/by-ingredient-restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    stockServiceClient.getSupplyOrdersByIngredientRestaurant(new GetSupplyOrdersByIngredientRestaurantRequest().setIngredientRestaurantId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.post('/api/stock/supply/order', (req: Request, res: Response) => {
    const {quantity, ingredientRestaurantId, supplierId} = req.body;
    const supplyOrderRequest = new CreateSupplyOrderRequest().setQuantity(quantity)
        .setIngredientRestaurantId(ingredientRestaurantId)
        .setSupplierId(supplierId);

    stockServiceClient.createSupplyOrder(supplyOrderRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.put('/api/stock/supply/order/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const {quantity, ingredientRestaurantId, supplierId} = req.body;
    const supplyOrderRequest = new UpdateSupplyOrderRequest().setId(Number(id)).setQuantity(quantity)
        .setIngredientRestaurantId(ingredientRestaurantId)
        .setSupplierId(supplierId);

    stockServiceClient.updateSupplyOrder(supplyOrderRequest, (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

stockRoutes.delete('/api/stock/supply/order/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    stockServiceClient.deleteSupplyOrder(new DeleteSupplyOrderRequest().setId(Number(id)), (error, response) => {
        if (error) {
            res.status(500)
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});