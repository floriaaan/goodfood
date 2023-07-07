import { UntypedServiceImplementation } from "@grpc/grpc-js";

import {
  GetIngredient,
  GetIngredients,
  CreateIngredient,
  UpdateIngredient,
  DeleteIngredient,
} from "@stock/handlers/stock/ingredient";

import {
  GetSupplier,
  GetSuppliers,
  CreateSupplier,
  UpdateSupplier,
  DeleteSupplier,
} from "@stock/handlers/stock/supplier";

import {
  GetIngredientRestaurant,
  GetIngredientRestaurantsByRestaurant,
  GetIngredientRestaurantsByProduct,
  CreateIngredientRestaurant,
  UpdateIngredientRestaurant,
  DeleteIngredientRestaurant,
} from "@stock/handlers/stock/ingredient_restaurant";

import {
  GetSupplyOrder,
  GetSupplyOrdersByIngredientRestaurant,
  GetSupplyOrdersByRestaurant,
  GetSupplyOrdersBySupplier,
  CreateSupplyOrder,
  UpdateSupplyOrder,
  DeleteSupplyOrder,
} from "@stock/handlers/stock/supply_order";

const stockHandlers: UntypedServiceImplementation = {
  GetIngredient,
  GetIngredients,
  CreateIngredient,
  UpdateIngredient,
  DeleteIngredient,

  GetSupplier,
  GetSuppliers,
  CreateSupplier,
  UpdateSupplier,
  DeleteSupplier,

  GetIngredientRestaurant,
  GetIngredientRestaurantsByRestaurant,
  GetIngredientRestaurantsByProduct,
  CreateIngredientRestaurant,
  UpdateIngredientRestaurant,
  DeleteIngredientRestaurant,

  GetSupplyOrder,
  GetSupplyOrdersByIngredientRestaurant,
  GetSupplyOrdersByRestaurant,
  GetSupplyOrdersBySupplier,
  CreateSupplyOrder,
  UpdateSupplyOrder,
  DeleteSupplyOrder,
};

export default stockHandlers;
