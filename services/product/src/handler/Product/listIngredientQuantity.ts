import { Product, ProductId, ProductIngredient, Recipe, RecipeResponse } from "@product/types/Product";
import {Data} from "@product/types";
import {log} from "@product/lib/log";
import prisma from "@product/lib/prisma";
import {ServerErrorResponse} from "@grpc/grpc-js";

export const listIngredientQuantity = async (
    {request}: Data<ProductId>,
    callback: (err: ServerErrorResponse | any, response: RecipeResponse | null) => void
) => {
    try {
        const {id} = request;

        const ingredientQuantity = await prisma.recipe.findMany({
            where: {product_id: id},
        }) as unknown as Recipe[];

        const RecipeResponse: RecipeResponse = {
            productId: id,
            recipe: ingredientQuantity.map((ingredient) =>
                ({ingredient_id: ingredient.ingredient_id, quantity: ingredient.quantity})
            ),
        };

        callback(null, RecipeResponse);
    } catch (error: ServerErrorResponse | any) {
        log.error(error);
        callback(error, null);
    }
};