import { Product, ProductType } from "@/types/product";

export const productList: Product[] = [
  {
    id: "product-1",
    name: "Pork qué prik thaï",
    price: 8.5,
    preparation: "15 min",
    weight: "420g",
    kilocalories: "182 kcal",
    allergens: [
      {
        id: "allergen-1",
        libelle: "Gluten",
      },
    ],
    nutriscore: 3,
    restaurant_id: "restaurant-1",
    type: ProductType.PLATS,
    image: require("@/assets/images/tmp/pork.png"),
    categories: [
      {
        id: "category-1",
        libelle: "Épicé",
        hexa_color: "#FBEAEF",
        icon: "🌶️",
      },
    ],
    comment: `Vous cherchez un plat savoureux qui vous donne un peu de piquant pour faire passer la monotonie de votre journée ? Ne cherchez pas plus loin que notre Pork qué prik thaï !\nAvec des poivrons rouges, verts et jaunes, des edamames et une généreuse portion de riz, ce sauté de porc au poivre est tout ce dont vous avez besoin pour ajouter un peu de piquant à votre vie.\nMais pas de soucis, aucun porc épic n'a été blessé pendant la préparation de ce plat !`,
  },
  {
    id: "product-2",
    name: "Goodwich au pesto verde",
    price: 7.5,
    preparation: "10 min",
    weight: "300g",
    kilocalories: "150 kcal",
    allergens: [
      {
        id: "allergen-1",
        libelle: "Gluten",
      },
    ],
    nutriscore: 2,
    restaurant_id: "restaurant-1",
    type: ProductType.PLATS,
    image: require("@/assets/images/tmp/wich.png"),
    categories: [
      {
        id: "category-2",
        libelle: "Frais",
        hexa_color: "#EAFBF5",
        icon: "🥗",
      },
    ],
    comment: ``,
  },
];

export const restaurantList = [
  {
    id: "restaurant-1",
    name: "Rouen Gros Horloge",
    address: "1 Rue du Gros Horloge, 76000 Rouen",
    coordinates: [49.440459, 1.094853],
    opening_hours: "11h30 - 14h30 / 18h30 - 22h30",
  },
  {
    id: "restaurant-2",
    name: "Rouen Pierre Corneille",
    address: "76 Rue Pierre Corneille, 76000 Rouen",
    coordinates: [49.442459, 1.094853],
    opening_hours: "11h30 - 14h30 / 18h30 - 22h30",
  },
];
