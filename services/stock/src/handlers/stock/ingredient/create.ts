import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { CreateIngredientRequest, Ingredient } from "@stock/types/stock";
import { Data } from "@stock/types";

export const CreateIngredient = async (
  { request }: Data<CreateIngredientRequest>,
  callback: (err: any, response: Ingredient | null) => void
) => {
  try {
    const { name, description } = request;

    let ingredient = await prisma.ingredient.findUnique({
      where: { name },
    });
    if (!ingredient)
      ingredient = await prisma.ingredient.create({
        data: { name, description },
      });
      
    callback(null, ingredient);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
