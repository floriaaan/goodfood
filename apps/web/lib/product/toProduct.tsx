import {ProductCreateEditFormValues} from "@/components/admin/product/form";
import {Allergen, Category, Product} from "@/types/product";

export const toProduct = (productFormValues: ProductCreateEditFormValues, categoryList: (Category | undefined)[] | undefined , allergenList: (Allergen | undefined)[] | undefined) => {

	return {
		id: "",
		name: productFormValues.name,
		image: productFormValues.image,
		comment: productFormValues.comment,
		price: parseFloat(productFormValues.price),
		preparation: productFormValues.preparation,
		weight: productFormValues.weight,
		kilocalories: productFormValues.kilocalories,
		nutriscore: productFormValues.nutriscore,
		type: parseInt(productFormValues.type),

		restaurantId: productFormValues.restaurantId,
		categoriesList: categoryList,
		allergensList: allergenList,
	} as Product;
}

export const toUpdateProduct = (sourceProduct: Product, productFormValues: ProductCreateEditFormValues, categoryList: (Category | undefined)[] | undefined, allergenList: (Allergen | undefined)[] | undefined) => {
	return {
		id: sourceProduct.id,
		name: productFormValues.name ?? sourceProduct.name,
		image: productFormValues.image ?? sourceProduct.image,
		comment: productFormValues.comment ?? sourceProduct.comment,
		price: parseFloat(productFormValues.price) ?? sourceProduct.price,
		preparation: productFormValues.preparation ?? sourceProduct.preparation,
		weight: productFormValues.weight ?? sourceProduct.weight,
		kilocalories: productFormValues.kilocalories ?? sourceProduct.kilocalories,
		nutriscore: productFormValues.nutriscore ?? sourceProduct.nutriscore,
		type: parseInt(productFormValues.type) ?? sourceProduct.type,

		restaurantId: productFormValues.restaurantId ?? sourceProduct.restaurantId,

		categoriesList: categoryList ?? sourceProduct.categoriesList,
		allergensList: allergenList ?? sourceProduct.allergensList

	} as Product;
}