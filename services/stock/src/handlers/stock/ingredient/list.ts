import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { GetIngredientsResponse } from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetIngredients = async (
  {}: Data<null>,
  callback: (err: any, response: GetIngredientsResponse | null) => void
) => {
  try {
    const ingredients = await prisma.ingredient.findMany();
    callback(null, { ingredients });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
