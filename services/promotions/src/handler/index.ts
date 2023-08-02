import { CreatePromotion } from "@promotions/handler/create";
import { GetPromotion } from "@promotions/handler/get";
import { UpdatePromotion } from "@promotions/handler/update";
import { DeletePromotion } from "@promotions/handler/delete";
import { GetPromotions } from "@promotions/handler/list-all";
import { GetPromotionsByRestaurant } from "@promotions/handler/list-by-restaurant";

export default {
  CreatePromotion,
  GetPromotion,
  UpdatePromotion,
  DeletePromotion,
  GetPromotions,
  GetPromotionsByRestaurant,
};
