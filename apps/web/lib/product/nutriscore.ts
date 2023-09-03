import { Product } from "@/types/product";

export const getNutriscoreImageUrl = ({ nutriscore }: Product) => {
  switch (nutriscore) {
    case 1:
      return "/images/nutriscore/nutriscore-a.png";
    case 2:
      return "/images/nutriscore/nutriscore-b.png";
    case 3:
      return "/images/nutriscore/nutriscore-c.png";
    case 4:
      return "/images/nutriscore/nutriscore-d.png";
    case 5:
      return "/images/nutriscore/nutriscore-e.png";
    default:
      return "";
  }
};
