import {Product_type} from "@prisma/client";
import {log} from "@product/lib/log";
import {Data} from "@product/types";
import {Product} from "@product/types/Product";
import prisma from "@product/lib/prisma";
import {ServerErrorResponse} from "@grpc/grpc-js";

export const CreateProduct = async (
    {request}: Data<Product>,
    callback: (err: ServerErrorResponse | null, response: Product | null) => void
) => {
    try {
        const {
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

        const product = await prisma.product.create({
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
                  createMany: {
                      data : recipe.map((ingredient) => ({
                          ingredient_id: ingredient.ingredient_id,
                          quantity: ingredient.quantity,
                      })),
                  }
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

