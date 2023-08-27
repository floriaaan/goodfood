import {Product_type} from "@prisma/client";
import {CreateAllergen} from "@product/handler/Allergen/create";
import {ReadAllergen} from "@product/handler/Allergen/read";
import {log} from "@product/lib/log";
import {Data} from "@product/types";
import {Product} from "@product/types/Product";
import prisma from "@product/lib/prisma";
import {ServerErrorResponse} from "@grpc/grpc-js";
import {ReadCategory} from "@product/handler/Category/read";
import {CreateCategory} from "@product/handler/Category/create";

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
            allergens
        } = request;
        const allergenIds: { id: string }[] = [];
        const categoryIds: { id: string }[] = [];
        allergens.map(async allergen => {
            if (allergen.id != "" && allergen.id != null) {
                await ReadAllergen({request: {id: allergen.id}},
                    (err, response) => {
                        if (err) {
                            log.error(err);
                            throw err;
                        } else {
                            if (response) allergenIds.push({id: response.id});
                        }
                    });
            } else {
                await CreateAllergen({request: allergen},
                    (err, response) => {
                        if (err) {
                            log.error(err);
                            throw err;
                        } else {
                            if (response)  allergenIds.push({id: response.id});
                        }
                    });
            }
        });

        categories.map(async category => {
            if (category.id != "" && category.id != null) {
                await ReadCategory({request: {id: category.id}},
                    (err, response) => {
                        if (err) {
                            log.error(err);
                            throw err;
                        } else {
                            if (response) categoryIds.push({id: response.id});
                        }
                    });
            } else {
                await CreateCategory({request: category},
                    (err, response) => {
                        if (err) {
                            log.error(err);
                            throw err;
                        } else {
                           if (response) categoryIds.push({id: response.id});
                        }
                    });
            }
        });

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
                    connect: categoryIds
                },
                allergens: {
                    connect: allergenIds
                }
            },
        }) as unknown as Product;

        callback(null, product);
    } catch (error: ServerErrorResponse | any) {
        log.error(error);
        callback(error, null);
    }
};

