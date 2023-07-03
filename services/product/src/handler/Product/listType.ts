import { ProductTypeList } from "@product/types/Product";
import { Product_type } from "@prisma/client";
import { log } from "@product/lib/log";
import { Data } from "@product/types";
import { ServerErrorResponse } from "@grpc/grpc-js";

export const GetProductTypeList = async (
	{ request }: Data<null>,
	callback: (err: ServerErrorResponse | null, response: ProductTypeList | null) => void
) => {
	try {
		const type = {productType: Object.values(Product_type)} as ProductTypeList

		callback(null, type)
	} catch (error: ServerErrorResponse | any) {
		log.error(error)
		callback(error, null)
	}
};