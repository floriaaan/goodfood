import { CreateRestaurant } from "@restaurant/handler/create";
import { GetRestaurant} from "@restaurant/handler/get";
import { UpdateRestaurant } from "@restaurant/handler/update";
import { DeleteRestaurant } from "@restaurant/handler/delete";
import { GetRestaurants } from "@restaurant/handler/list-all";
import { GetRestaurantsByLocation } from "@restaurant/handler/list-by-location";

export default {
  CreateRestaurant,
  GetRestaurant,
  UpdateRestaurant,
  DeleteRestaurant,
  GetRestaurants,
  GetRestaurantsByLocation,
};
