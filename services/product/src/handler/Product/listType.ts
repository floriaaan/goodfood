/*import { Product_type } from "@prisma/client";
import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { ProductType, ProductTypeList } from "@product/types/Product";

export const GetProductTypeList = async (
	data: Data<null>,
	callback: (err: any, response: ProductTypeList | null) => void
) => {
	log.debug("Request received at GetProductTypeList handler\n");
	try {
		const enumValues = Object.values(ProductType);

		const type = {} as ProductTypeList;
		type.productTypes = Array.from(Object.values(Product_type).entries()).map((entrie, index) => {
			if(entrie instanceof String)
				return enumValues[index - 1]
		}) as ProductType[];

		callback(null, type);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};*/