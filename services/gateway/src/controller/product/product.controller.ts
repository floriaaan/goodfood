import { withCheck } from "@gateway/middleware/auth";
import { productServiceClient } from "@gateway/services/clients";
import { extendProduct } from "@gateway/services/product.service";
import { Request, Response, Router } from "express";
import {Allergen, Category, File, Product, ProductId, ProductType, Recipe, RestaurantId} from "../../proto/product_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
export const productRoutes = Router();

productRoutes.get("/api/product/by-restaurant/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
               in: 'path',
               required: true,
               type: 'string'
         } */
  const { id } = req.params;

  productServiceClient.getProductList(new RestaurantId().setId(id), async (error, r) => {
    if (error) return res.status(500).send({ error });
    else {
      const response = r.toObject();
      const productsList = await Promise.all(response.productsList.map((p) => extendProduct(p)));
      return res.status(200).json({ ...response, productsList });
    }
  });
});

productRoutes.get("/api/product/:id", async (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
               in: 'path',
               required: true,
               type: 'string'
         } */
  const { id } = req.params;
  const product = (await new Promise((resolve, reject) => {
    productServiceClient.readProduct(new ProductId().setId(id), (error, response) => {
      if (error) reject(error);
      else resolve(response.toObject());
    });
  })) as Product.AsObject;
  if (!product) return res.status(404).send({ error: "Product not found" });

  const extendedProduct = await extendProduct(product); // can't be null because product is not null

  return res.status(200).json(extendedProduct);
});

productRoutes.get("/api/product/type", (_: Request, res: Response) => {
  productServiceClient.getProductTypeList(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.delete("/api/product/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
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
});

productRoutes.post("/api/product", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
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
                nutriscore: "A",
                categoriesList: [{
                        id: "category:id",
                    }],
                allergensList: [{
                        id:"allergen:id"
                    }],,
                "recipeList": [
                  { "ingredient_id": "2", "quantity": 15 }
                ]
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
    categoriesList,
    allergensList,
    recipeList,
  } = req.body;

  const categories = categoriesList?.map((category: { id: string }) => new Category().setId(category.id));
  const allergens = allergensList?.map((allergen: { id: string }) => new Allergen().setId(allergen.id));
  const recipe = recipeList.map((ingredientList: { ingredientId: string; quantity: number }) =>
    new Recipe().setQuantity(ingredientList.quantity).setIngredientId(ingredientList.ingredientId),
  );

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
    .setCategoriesList(categories)
    .setAllergensList(allergens)
    .setRecipeList(recipe);

  productServiceClient.createProduct(product, async (error, r) => {
    if (error) return res.status(500).send({ error });
    else {
      const response = r.toObject();
      const extendedProduct = await extendProduct(response);
      return res.status(201).json(extendedProduct);
    }
  });
});

productRoutes.put("/api/product/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
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
                nutriscore: "A",
                categories: [{
                        id: "category:id"
                    }],
                allergens: [{
                        id:"allergen:id"
                    }],
                "recipeList": [
                  { "id": "2", "quantity": 15 }
                ]
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
    categoriesList,
    allergensList,
    recipeList,
  } = req.body;

  const categories = categoriesList.map((category: { id: string }) => new Category().setId(category.id));
  const allergens = allergensList.map((allergen: { id: string }) => new Allergen().setId(allergen.id));
  const recipe = recipeList.map((ingredientList: { ingredientId: string; quantity: number }) =>
    new Recipe().setQuantity(ingredientList.quantity).setIngredientId(ingredientList.ingredientId),
  );

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
    .setCategoriesList(categories)
    .setAllergensList(allergens)
    .setRecipeList(recipe);

  productServiceClient.updateProduct(product, async (error, r) => {
    if (error) return res.status(500).send({ error });
    else {
      const response = r.toObject();
      const extendedProduct = await extendProduct(response);
      return res.status(201).json(extendedProduct);
    }
  });
});

productRoutes.post("/api/product/image", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'string',
                input_file: 'string'
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        } */
  const { name, input_file } = req.body;

  const file = new File().setName(name).setData(input_file);
  productServiceClient.uploadImage(file, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

productRoutes.get(
	"/api/product/ingredient-quantity/:id",
	withCheck({ role: ["MANAGER", "ADMIN"] }),
	(req: Request, res: Response) => {
		/* #swagger.parameters['id'] = {
							 in: 'path',
							 required: true,
							 type: 'string'
				 }
				#swagger.parameters['authorization'] = {
						in: 'header',
						required: true,
						type: 'string'
				}  */
		const { id } = req.params;
		productServiceClient.getIngredientByProduct(new ProductId().setId(id), (error, response) => {
			if (error) return res.status(500).send({ error });
			else return res.status(200).json(response.toObject());
		});
	},
);