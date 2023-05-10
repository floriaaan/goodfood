import { Product_type } from "@prisma/client";
import { CreateAllergen } from "@product/handler/Allergen/create";
import { ReadAllergen } from "@product/handler/Allergen/read";
import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { Allergen } from "@product/types/Allergen";
import { Category } from "@product/types/Category";
import { Product } from "@product/types/Product";
import prisma from "@product/lib/prisma";

export const CreateProduct = async (
	data: Data<Product>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at CreateProduct handler\n", data.request);
	try {
		const { name, image, comment, price, preparation, weight, kilocalories, nutriscore, restaurant_id, type, categories, allergens } = data.request;

		allergens.map(async allergen => {
			if(allergen.id != "" && allergen.id != null)
				ReadAllergen({
					request: { id: allergen.id }
				}, handlMapAllergen);
			else
				CreateAllergen({
					request:  allergen
				}, handlMapAllergen);
		});

		categories.map(async categorie => {
			const categorieFind = await prisma.category.findFirst({
				where : { libelle: categorie.libelle } 
			}) as Category
			if(categorieFind)
				categorie = categorieFind;
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
		});

		callback(null, product);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}

	const handlMapAllergen = (err: any, response: Allergen | null) => {
		if (err) {
			log.error(err);
		} else {
			return response;
		}
	};
};

