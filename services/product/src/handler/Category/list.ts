import { log } from "@product/lib/log";
import prisma from "@product/lib/prisma";
import { Data } from "@product/types";
import { Category, CategoryList } from "@product/types/Category";

export const GetCategoryList = async (
	data: Data<null>,
	callback: (err: any, response: CategoryList | null) => void
) => {
	log.debug("Request received at GetCategoryList handler\n");
	try {
		const categorys = await prisma.category.findMany() as Category[];		
				
		const categoryList = {} as CategoryList;

		categorys.map(category => {
			if(categoryList.categories == null)
				categoryList.categories = [category] as Category[];
			else
				categoryList.categories.push(category);
		});

		callback(null, categoryList);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};