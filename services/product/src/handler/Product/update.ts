import {Product} from "@product/types/Product";
import {Data} from "@product/types";
import {prisma} from "@product/lib/prisma";
import {log} from "@product/lib/log";
import {Product_type, Recipe} from "@prisma/client";
import {ServerErrorResponse} from "@grpc/grpc-js";
import * as console from "console";

export const UpdateProduct = async (
    {request}: Data<Product>,
    callback: (err: ServerErrorResponse | null, response: any) => void
) => {

    try {
        const {
            id,
            name,
            image,
            comment,
            price,
            preparation,
            weight,
            kilocalories,
            nutriscore,
            restaurant_id,
            type,
            categories,
            allergens,
            recipe
        } = request;

        const allRecipe = await prisma.recipe.findMany();
        console.log("FullAllRecipe", allRecipe.map((ingredient) => ingredient.id + " " + ingredient.ingredient_id + " " + ingredient.quantity + " " + ingredient.product_id).join(", "));

        const fullRecipe = await Promise.all(recipe.map(async (ingredient) => {
            console.log("ingredient", ingredient.ingredient_id + " " + id);
            const recipe = await prisma.recipe.findFirst({
                where: {ingredient_id: ingredient.ingredient_id, product_id: id}
            }) || {id: "", ingredient_id: ingredient.ingredient_id, product_id: id, quantity: ingredient.quantity} as unknown as Recipe;
            console.log("recipe", recipe.id + " " + recipe.ingredient_id + " " + recipe.quantity + " " + recipe.product_id);
            return recipe;
        }) as unknown as Recipe[]);

        console.log("fullRecipe", fullRecipe.map((ingredient) => ingredient.id + " " + ingredient.ingredient_id + " " + ingredient.quantity + " " + ingredient.product_id));

        const product = await prisma.product.update({
            where: {id},
            data: {
                name,
                image,
                comment,
                price,
                preparation,
                weight,
                kilocalories,
                nutriscore,
                restaurant_id,
                type: type as unknown as Product_type,
                categories: {
                    connect: categories.map((category) => ({id: category.id}))
                },
                allergens: {
                    connect: allergens.map((allergen) => ({id: allergen.id}))
                },
                recipe: {
                    connectOrCreate: fullRecipe.map((ingredient) => ({
                        where: {id: ingredient.id},
                        create: {
                            ingredient_id: ingredient.ingredient_id,
                            quantity: ingredient.quantity,
                        }
                    }))
                }
            },
            include: {
                categories: true,
                allergens: true,
                recipe: true
            }
        }) as unknown as Product;

        callback(null, product);
    } catch (error: ServerErrorResponse | any) {
        log.error(error);
        callback(error, null);
    }
};