import { Category } from "@product/types/Category"; 
import { Data } from "@product/types";
import { prisma } from "@product/lib/prisma";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const UpdateCategory = async (
	data: Data<Category>,
	callback: (err: any, response: Category | null) => void
) => {
	log.debug("Request received at UpdateCategory handler\n", data.request);
	try {
		const { id, libelle, hexa_color, icon } = data.request;

		if (!libelle && libelle.trim().length <= 0 &&
			!icon && icon.trim().length <= 0 &&
			!hexa_color && hexa_color.trim().length <= 0
		   )
			throw(Error("Aucun des valeurs de la catégorie ne peuvent être null") as ServerErrorResponse)

		var categorieInDb =	await prisma.category.findMany({
				where: {
						libelle: libelle,
						icon: icon,
						hexa_color: hexa_color
					}
				}) as Category[] | null
		if(categorieInDb == null)
			throw(Error("La catégorie existe déjà") as ServerErrorResponse)

		const category = await prisma.category.update({ 
		where : { id },
			data: {
				libelle,
				icon,
				hexa_color
			},
		}) as Category;

		callback(null, category);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};