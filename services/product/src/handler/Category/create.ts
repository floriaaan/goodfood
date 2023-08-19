import { Category } from "@product/types/Category"; 
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import prisma from "@product/lib/prisma";

export const CreateCategory = async (
	{ request }: Data<Category>,
	callback: (err: ServerErrorResponse | any, response: Category | null) => void
) => {
	try {
		const { libelle, hexa_color, icon } = request;

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

		const category = await prisma.category.create({
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