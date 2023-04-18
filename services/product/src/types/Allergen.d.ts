export interface AllergenId {
	id: string;
}

export interface Allergen {
	id: string;
	libelle: string;
	products: Product[];
}
