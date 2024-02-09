import { CreateProduct } from "./create";
import { ReadProduct } from "./read";
import { UpdateProduct } from "./update";
import { DeleteProduct } from "./delete";
import { getProductList } from "./list";
import { GetProductTypeList } from "./listType";
import { UploadImage } from "../Image/upload";
import { listIngredientQuantity } from "@product/handler/Product/listIngredientQuantity";

export default {
	CreateProduct,
	ReadProduct,
	UpdateProduct,
	DeleteProduct,
	getProductList,
	GetProductTypeList,
	GetIngredientByProduct: listIngredientQuantity,
	UploadImage,
};