import { stockServiceClient } from "@gateway/services/clients";
import {
  GetIngredientRestaurantsByProductRequest,
  GetIngredientRestaurantsByRestaurantRequest,
  IngredientRestaurant,
  UpdateIngredientRestaurantRequest,
} from "@gateway/proto/stock_pb";
import { getIngredientByProduct } from "@gateway/services/product.service";

export const getIngredientRestaurantsByProduct = (
  productId: string,
): Promise<Array<IngredientRestaurant> | undefined> => {
  return new Promise((resolve, reject) => {
    stockServiceClient.getIngredientRestaurantsByProduct(
      new GetIngredientRestaurantsByProductRequest().setProductId(productId),
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.getIngredientRestaurantsList());
        }
      },
    );
  });
};
export const getIngredientByRestaurant = (restaurantId: string): Promise<Array<IngredientRestaurant> | undefined> => {
  return new Promise((resolve, reject) => {
    stockServiceClient.getIngredientRestaurantsByRestaurant(
      new GetIngredientRestaurantsByRestaurantRequest().setRestaurantId(restaurantId),
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.getIngredientRestaurantsList());
        }
      },
    );
  });
};

export const updateStock = (ingredient: IngredientRestaurant): Promise<IngredientRestaurant | undefined> => {
  const ingredientRestaurantRequest = new UpdateIngredientRestaurantRequest()
    .setId(ingredient.getId())
    .setAlertThreshold(ingredient.getAlertThreshold())
    .setQuantity(ingredient.getQuantity())
    .setInProductListList(ingredient.getInProductListList())
    .setUnitPrice(ingredient.getUnitPrice())
    .setPricePerKilo(ingredient.getPricePerKilo())
    .setRestaurantId(ingredient.getRestaurantId())
    .setIngredientId(ingredient.getIngredientId())
    .setSupplierId(ingredient.getSupplierId());
  return new Promise((resolve, reject) => {
    stockServiceClient.updateIngredientRestaurant(ingredientRestaurantRequest, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const updateQuantityFromBasket = async (productId: string): Promise<IngredientRestaurant[] | undefined> => {
  const ingredientsList = await getIngredientRestaurantsByProduct(productId);
  if (!ingredientsList) return;

  const ingredientByProduct = await getIngredientByProduct(productId);
  if (!ingredientByProduct) return;

  return new Promise(async (resolve, reject) => {
    try {
      ingredientsList.map(async (ingredient) => {
        const ingredientQuantity =
          ingredientByProduct
            .toObject()
            .recipeList.find((i) => i.ingredientId === ingredient.getIngredientId().toString())?.quantity || 0;
        await updateStock(ingredient.setQuantity(ingredient.getQuantity() - ingredientQuantity));
      });
      const ingredientRest = await getIngredientByRestaurant(ingredientsList[0].getRestaurantId());
      resolve(ingredientRest);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
