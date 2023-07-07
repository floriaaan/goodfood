import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { UpdateIngredientRequest, Ingredient } from "@stock/types/stock";
import { Data } from "@stock/types";

export const UpdateIngredient = async (
  { request }: Data<UpdateIngredientRequest>,
  callback: (err: any, response: Ingredient | null) => void
) => {
  try {
    const { name, id, description } = request;
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: { name, description },
    });

    callback(null, ingredient);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
