import { Product } from "@/types/product";

export const getNutriscoreImageUrl = ({ nutriscore }: Product) => {
  if (typeof nutriscore === "number")
    switch (nutriscore) {
      case 1:
        return "/images/nutriscore/nutriscore-a.svg";
      case 2:
        return "/images/nutriscore/nutriscore-b.svg";
      case 3:
        return "/images/nutriscore/nutriscore-c.svg";
      case 4:
        return "/images/nutriscore/nutriscore-d.svg";
      case 5:
        return "/images/nutriscore/nutriscore-e.svg";
      default:
        return "";
    }
  else if (typeof nutriscore === "string")
    switch (nutriscore.toLowerCase()) {
      case "a":
        return "/images/nutriscore/nutriscore-a.svg";
      case "b":
        return "/images/nutriscore/nutriscore-b.svg";
      case "c":
        return "/images/nutriscore/nutriscore-c.svg";
      case "d":
        return "/images/nutriscore/nutriscore-d.svg";
      case "e":
        return "/images/nutriscore/nutriscore-e.svg";
      default:
        return "";
    }
};
