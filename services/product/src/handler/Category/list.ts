import { ServerErrorResponse } from "@grpc/grpc-js";
import { log } from "@product/lib/log";
import prisma from "@product/lib/prisma";
import { Data } from "@product/types";
import { Category, CategoryList } from "@product/types/Category";

export const GetCategoryList = async (
	{request}: Data<null>,
	callback: (err: ServerErrorResponse | any, response: CategoryList | null) => void
) => {
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
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};