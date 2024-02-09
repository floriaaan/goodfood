import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { GetIngredientRequest, Ingredient } from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetIngredient = async (
  { request }: Data<GetIngredientRequest>,
  callback: (err: any, response: Ingredient | null) => void
) => {
  try {
    const { id } = request;
    const ingredient = await prisma.ingredient.findUniqueOrThrow({
      where: { id },
    });
    callback(null, ingredient);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
