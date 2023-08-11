import {Request, Response, Router} from 'express';
import {productServiceClient} from '../../services/clients/product.client';
import {Allergen, Category, File, Product, ProductId, RestaurantId} from '../../proto/product_pb';
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import * as fs from "fs";

export const productRoutes = Router();

productRoutes.get('/api/product/by-restaurant/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const restaurantId = new RestaurantId().setId(id)

    productServiceClient.getProductList(restaurantId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.get('/api/product/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const productId = new ProductId().setId(id)

    productServiceClient.readProduct(productId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.get('/api/product/type', (req: Request, res: Response) => {
    productServiceClient.getProductTypeList(new Empty(), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.delete('/api/product/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const productId = new ProductId().setId(id)
    productServiceClient.deleteProduct(productId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.post('/api/product', (req: Request, res: Response) => {
    const {
        restaurantId,
        type,
        name,
        image,
        comment,
        price,
        preparation,
        weight,
        kilocalories,
        nutriscore,
        categories,
        allergens
    } = req.body;

    const allergensList = allergens.map((allergen: any) => new Allergen().setLibelle(allergen.label));
    const categoryList = categories.map((category: any) => new Category()
        .setLibelle(category.label)
        .setHexaColor(category.hexaColor)
        .setIcon(category.icon));

    const productId = new Product().setRestaurantId(Number(restaurantId)).setType(type)
        .setName(name)
        .setImage(image)
        .setComment(comment)
        .setPrice(price)
        .setPreparation(preparation)
        .setWeight(weight)
        .setKilocalories(kilocalories)
        .setNutriscore(nutriscore)
        .setCategoriesList(categoryList)
        .setAllergensList(allergensList);

    productServiceClient.createProduct(productId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.put('/api/product/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const {
        restaurantId,
        type,
        name,
        image,
        comment,
        price,
        preparation,
        weight,
        kilocalories,
        nutriscore,
        categories,
        allergens
    } = req.body;

    const allergensList = allergens.map((allergen: any) => new Allergen().setLibelle(allergen.label));
    const categoryList = categories.map((category: any) => new Category()
        .setLibelle(category.label)
        .setHexaColor(category.hexaColor)
        .setIcon(category.icon));

    const productId = new Product().setId(id).setRestaurantId(Number(restaurantId)).setType(type)
        .setName(name)
        .setImage(image)
        .setComment(comment)
        .setPrice(price)
        .setPreparation(preparation)
        .setWeight(weight)
        .setKilocalories(kilocalories)
        .setNutriscore(nutriscore)
        .setCategoriesList(categoryList)
        .setAllergensList(allergensList);

    productServiceClient.createProduct(productId, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

productRoutes.post('/api/product/image', (req: Request, res: Response) => {
    const {input_file} = req.body;
    var bitmap = fs.readFileSync(input_file);
    var base64File = new Buffer(bitmap).toString('base64');

    const file = new File().setName(input_file).setData(base64File);
    productServiceClient.uploadImage(file, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});