import {stockServiceClient} from "@gateway/services/clients";
import {
  GetIngredientRestaurantsByProductRequest,
  IngredientRestaurant,
  UpdateIngredientRestaurantRequest,
} from "@gateway/proto/stock_pb";
import {getProduct} from "@gateway/services/product.service";

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
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const updateQuantityFromBasket = async (productId: string): Promise<IngredientRestaurant | undefined> => {
  const ingredientsList = await getIngredientRestaurantsByProduct(productId);
  if (!ingredientsList) return;
  const ingredientRestaurantListFromProduct = await getProduct(productId);
  if (!productFromService) return;
  ingredientsList.map(async (ingredient) => {
    updateStock(ingredient.setQuantity(ingredient.getQuantity() - ));
  });

  return new Promise((resolve, reject) => {
    stockServiceClient.updateIngredientRestaurant(new UpdateIngredientRestaurantRequest(), (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
