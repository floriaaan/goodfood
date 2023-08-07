export interface AllergenId {
	id: string;
}

export interface Allergen {
	id: string;
	libelle: string;
}

export interface AllergenList{
	allergens: Allergen[];
}
