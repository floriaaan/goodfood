import { Request, Response, Router } from "express";
import { productServiceClient } from "../../services/clients/product.client";
import { Allergen, Category, File, Product, ProductId, ProductType, RestaurantId } from "../../proto/product_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import * as fs from "fs";
import { withCheck } from "@gateway/middleware/auth";

export const productRoutes = Router();

productRoutes.get("/api/product/by-restaurant/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
               in: 'path',
               required: true,
               type: 'string'
         } */
  const { id } = req.params;

  productServiceClient.getProductList(new RestaurantId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.get("/api/product/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
               in: 'path',
               required: true,
               type: 'string'
         } */
  const { id } = req.params;
  productServiceClient.readProduct(new ProductId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.get("/api/product/type", (_: Request, res: Response) => {
  productServiceClient.getProductTypeList(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.delete(
  "/api/product/:id",
  withCheck({ role: ["ACCOUNTANT", "ADMIN"] }),
  (req: Request, res: Response) => {
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
    const productId = new ProductId().setId(id);
    productServiceClient.deleteProduct(productId, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

productRoutes.post("/api/product", withCheck({ role: ["ACCOUNTANT", "ADMIN"] }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                restaurantId: "restaurant:id",
                type: {'$ref': '#/definitions/ProductType'},
                name: "name",
                image: "bucket_url_to_image",
                comment: "comment",
                price: 0,
                preparation: "preparation",
                weight: "weight",
                kilocalories: "0",
                nutriscore: 0,
                categories: [{
                        id: "category:id",
                    }],
                allergens: [{
                        id:"allergen:id"
                    }],
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        } */

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
    allergens,
    categories,
  } = req.body;

  const categoryList = categories.map((category: { id: string }) => new Category().setId(category.id));
  const allergenList = allergens.map((allergen: { id: string }) => new Allergen().setId(allergen.id));

  const product = new Product()
    .setRestaurantId(restaurantId)
    .setType(ProductType[type as keyof typeof ProductType])
    .setName(name)
    .setImage(image)
    .setComment(comment)
    .setPrice(price)
    .setPreparation(preparation)
    .setWeight(weight)
    .setKilocalories(kilocalories)
    .setNutriscore(nutriscore)
    .setCategoriesList(categoryList)
    .setAllergensList(allergenList);

  productServiceClient.createProduct(product, (error, response) => {
    if (error) {
      return res.status(500).send({ error });
    } else return res.status(201).json(response.toObject());
  });
});

productRoutes.put("/api/product/:id", withCheck({ role: ["ACCOUNTANT", "ADMIN"] }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                restaurantId: "restaurant:id",
                type: {'$ref': '#/definitions/ProductType'},
                name: "name",
                image: "bucket_url_to_image",
                comment: "comment",
                price: 0,
                preparation: "preparation",
                weight: "weight",
                kilocalories: "0",
                nutriscore: 0,
                categories: [{
                        id: "category:id"
                    }],
                allergens: [{
                        id:"allergen:id"
                    }],
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
    allergens,
  } = req.body;

  const categoryList = categories.map((category: { id: string }) => new Category().setId(category.id));
  const allergenList = allergens.map((allergen: { id: string }) => new Allergen().setId(allergen.id));

  const product = new Product()
    .setId(id)
    .setRestaurantId(restaurantId)
    .setType(ProductType[type as keyof typeof ProductType])
    .setName(name)
    .setImage(image)
    .setComment(comment)
    .setPrice(price)
    .setPreparation(preparation)
    .setWeight(weight)
    .setKilocalories(kilocalories)
    .setNutriscore(nutriscore)
    .setCategoriesList(categoryList)
    .setAllergensList(allergenList);

  productServiceClient.updateProduct(product, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.post(
  "/api/product/image",
  withCheck({ role: ["ACCOUNTANT", "ADMIN"] }),
  (req: Request, res: Response) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                input_file: Buffer
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        } */
    const { input_file } = req.body;
    const bitmap = fs.readFileSync(input_file);
    const base64File = new Buffer(bitmap).toString("base64");

    const file = new File().setName(input_file).setData(base64File);
    productServiceClient.uploadImage(file, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);
