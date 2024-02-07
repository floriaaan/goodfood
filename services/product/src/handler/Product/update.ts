import {Product} from "@product/types/Product";
import {Data} from "@product/types";
import {prisma} from "@product/lib/prisma";
import {log} from "@product/lib/log";
import {Product_type} from "@prisma/client";
import {ServerErrorResponse} from "@grpc/grpc-js";

export const UpdateProduct = async (
    {request}: Data<Product>,
    callback: (err: ServerErrorResponse | null, response: any) => void
) => {
    log.error(request);
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
            allergens
        } = request;

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