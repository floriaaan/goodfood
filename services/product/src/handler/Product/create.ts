import { Product_type } from "@prisma/client";
import { CreateAllergen } from "@product/handler/Allergen/create";
import { ReadAllergen } from "@product/handler/Allergen/read";
import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { Allergen } from "@product/types/Allergen";
import { Category } from "@product/types/Category";
import { Product } from "@product/types/Product";
import prisma from "@product/lib/prisma";
import { ServerErrorResponse } from "@grpc/grpc-js";
import {ReadCategory} from "@product/handler/Category/read";
import {CreateCategory} from "@product/handler/Category/create";

export const CreateProduct = async (
	{ request }: Data<Product>,
	callback: (err: ServerErrorResponse | null, response: Product | null) => void
) => {
	try {
		const { name, image, comment, price, preparation, weight, kilocalories, nutriscore, restaurant_id, type, categories, allergens } = request;

		const handleMapRequest = (err: any, response: Allergen | Category | null) => {
			if (err) {
				log.error(err);
			} else {
				return response;
			}
		};

		allergens.map(async allergen => {
			if(allergen.id != "" && allergen.id != null)
				await ReadAllergen({
					request: {id: allergen.id}
				}, () =>{
					CreateAllergen({
						request: allergen
					}, handleMapRequest)
				});
			else
				await CreateAllergen({
					request: allergen
				}, handleMapRequest);
		});

		categories.map(async category => {
			if(category.id != "" && category.id != null)
				await ReadCategory({
					request: {id: category.id}
				}, () =>{
					CreateCategory({
						request: category
					}, handleMapRequest)
				});
			else
				await CreateCategory({
					request: category
				}, handleMapRequest);
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
					connect: categories
				}, 
				allergens: {
					connect: allergens
				}
			},
		}) as unknown as Product;

		callback(null, product);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};

