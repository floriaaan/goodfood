import { Product_type } from "../../types/Product";
import { Data } from "../../types";
import { Product_type as productType} from "@prisma/client";
import { log } from "../../lib/log";

export const ListProductType = async (
	data: Data<Product_type>,
	callback: (err: any, response: any) => void
) => {
	log.debug("Request received at ListProduct handler\n", data.request);
	try {
		const type = productType;

		callback(null, type);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};