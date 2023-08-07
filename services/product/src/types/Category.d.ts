export interface CategoryId {
	id: string;
}

export interface Category {
	id: string;
	libelle: string;
	hexa_color: string;
	icon: string;
}

export interface CategoryList{
	categories: Category[];
}