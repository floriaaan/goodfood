import { Status } from "@/types/global";
import { BasketSnapshot, DeliveryType, Order } from "@/types/order";
import { Payment, PaymentStatus, User as PaymentUser } from "@/types/payment";
import { Allergen, Category, Product, ProductType } from "@/types/product";
import { Promotion } from "@/types/promotion";
import { Restaurant } from "@/types/restaurant";
import { Ingredient, IngredientRestaurant, Supplier, SupplyOrder } from "@/types/stock";
import { MainAddress, User } from "@/types/user";
import { Basket } from "@/types/basket";
import { Delivery, DeliveryPerson } from "@/types/delivery";

// Fixed, French, coherent fixtures used by the in-browser mock router (lib/mocks/router.ts).
// Same test accounts as services/gateway-mock, so devs can switch between the two freely.
// All passwords are "password".

const address = (id: number, street: string, zipcode: string, city: string, lat: number, lng: number): MainAddress => ({
  id,
  street,
  zipcode,
  city,
  country: "France",
  lat,
  lng,
});

// The frontend's User type has no password field (the real user service never returns one);
// the mock router needs one to check credentials, so it's carried as a local extension.
export type MockUser = User & { password: string };

export const users: MockUser[] = [
  {
    id: "user-admin",
    firstName: "Ada",
    lastName: "Admin",
    email: "admin@goodfood.com",
    password: "password",
    phone: "0600000001",
    mainaddressid: "1001",
    mainaddress: address(1001, "8 Rue de Rivoli", "75004", "Paris", 48.8566, 2.3522),
    roleid: 1,
    role: { id: 1, code: "ADMIN", label: "Administrateur" },
  },
  {
    id: "user-manager-1",
    firstName: "Marc",
    lastName: "Manager",
    email: "manager@goodfood.com",
    password: "password",
    phone: "0600000002",
    mainaddressid: "1002",
    mainaddress: address(1002, "5 Place Bellecour", "69002", "Lyon", 45.7578, 4.832),
    roleid: 2,
    role: { id: 2, code: "MANAGER", label: "Manager" },
  },
  {
    id: "user-manager-2",
    firstName: "Sophie",
    lastName: "Girard",
    email: "manager2@goodfood.com",
    password: "password",
    phone: "0600000005",
    mainaddressid: "1003",
    mainaddress: address(1003, "22 Cours de l'Intendance", "33000", "Bordeaux", 44.8412, -0.5761),
    roleid: 2,
    role: { id: 2, code: "MANAGER", label: "Manager" },
  },
  {
    id: "user-customer",
    firstName: "Cléa",
    lastName: "Petit",
    email: "user@goodfood.com",
    password: "password",
    phone: "0600000003",
    mainaddressid: "1004",
    mainaddress: address(1004, "7 Rue de la Paix", "76600", "Le Havre", 49.4938, 0.1077),
    roleid: 3,
    role: { id: 3, code: "USER", label: "Utilisateur" },
  },
  {
    id: "user-customer-2",
    firstName: "Nicolas",
    lastName: "Roche",
    email: "nicolas.roche@example.fr",
    password: "password",
    phone: "0600000006",
    mainaddressid: "1005",
    mainaddress: address(1005, "14 Rue Sainte-Catherine", "33000", "Bordeaux", 44.8404, -0.5731),
    roleid: 3,
    role: { id: 3, code: "USER", label: "Utilisateur" },
  },
  {
    id: "user-delivery",
    firstName: "Dan",
    lastName: "Morel",
    email: "delivery@goodfood.com",
    password: "password",
    phone: "0600000004",
    mainaddressid: "1006",
    mainaddress: address(1006, "3 Rue Saint-Vincent-de-Paul", "75010", "Paris", 48.8768, 2.3548),
    roleid: 4,
    role: { id: 4, code: "DELIVERY_PERSON", label: "Livreur" },
  },
];

const restaurant = (
  id: string,
  name: string,
  street: string,
  zipcode: string,
  city: string,
  lat: number,
  lng: number,
  description: string,
  phone: string,
): Restaurant => ({
  id,
  name,
  address: { lat, lng, street, city, zipcode, country: "France" },
  openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
  description,
  phone,
  useridsList: [],
  createdat: "2023-11-01T09:00:00.000Z",
  updatedat: "2023-11-01T09:00:00.000Z",
});

export const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "GoodFood Paris Bastille",
    address: {
      lat: 48.8532,
      lng: 2.3692,
      street: "12 Rue de la Roquette",
      city: "Paris",
      zipcode: "75011",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Cuisine de saison au cœur du 11e arrondissement.",
    phone: "01 43 55 12 08",
    useridsList: ["user-manager-1"],
    createdat: "2023-01-10T09:00:00.000Z",
    updatedat: "2023-01-10T09:00:00.000Z",
  },
  {
    id: "rest-2",
    name: "GoodFood Lyon Presqu'île",
    address: {
      lat: 45.7578,
      lng: 4.832,
      street: "18 Rue de la République",
      city: "Lyon",
      zipcode: "69002",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Spécialités lyonnaises revisitées, produits locaux.",
    phone: "04 78 42 11 34",
    useridsList: ["user-manager-1"],
    createdat: "2023-02-14T09:00:00.000Z",
    updatedat: "2023-02-14T09:00:00.000Z",
  },
  {
    id: "rest-3",
    name: "GoodFood Bordeaux Chartrons",
    address: {
      lat: 44.8482,
      lng: -0.5645,
      street: "40 Rue Notre-Dame",
      city: "Bordeaux",
      zipcode: "33000",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Terrasse et cuisine du marché dans le quartier des Chartrons.",
    phone: "05 56 44 09 21",
    useridsList: ["user-manager-2"],
    createdat: "2023-03-20T09:00:00.000Z",
    updatedat: "2023-03-20T09:00:00.000Z",
  },

  // Île-de-France
  {
    id: "rest-4",
    name: "GoodFood Paris Montmartre",
    address: {
      lat: 48.8867,
      lng: 2.3431,
      street: "9 Rue des Trois Frères",
      city: "Paris",
      zipcode: "75018",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Petite adresse de quartier au pied du Sacré-Cœur.",
    phone: "01 42 51 33 07",
    useridsList: ["user-manager-1"],
    createdat: "2023-05-08T09:00:00.000Z",
    updatedat: "2023-05-08T09:00:00.000Z",
  },
  {
    id: "rest-5",
    name: "GoodFood Paris Marais",
    address: {
      lat: 48.8606,
      lng: 2.3622,
      street: "27 Rue des Archives",
      city: "Paris",
      zipcode: "75004",
      country: "France",
    },
    openinghoursList: ["Lun-Dim 11h30-14h30 / 18h30-23h00"],
    description: "Cuisine bistronomique dans une ancienne échoppe du Marais.",
    phone: "01 48 87 22 19",
    useridsList: ["user-manager-1"],
    createdat: "2023-06-02T09:00:00.000Z",
    updatedat: "2023-06-02T09:00:00.000Z",
  },

  // Auvergne-Rhône-Alpes
  {
    id: "rest-6",
    name: "GoodFood Lyon Croix-Rousse",
    address: {
      lat: 45.7745,
      lng: 4.832,
      street: "14 Grande Rue de la Croix-Rousse",
      city: "Lyon",
      zipcode: "69004",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Bouchon moderne sur les pentes de la Croix-Rousse.",
    phone: "04 78 28 44 12",
    useridsList: ["user-manager-1"],
    createdat: "2023-07-11T09:00:00.000Z",
    updatedat: "2023-07-11T09:00:00.000Z",
  },
  {
    id: "rest-7",
    name: "GoodFood Lyon Part-Dieu",
    address: {
      lat: 45.7601,
      lng: 4.8567,
      street: "129 Rue Servient",
      city: "Lyon",
      zipcode: "69003",
      country: "France",
    },
    openinghoursList: ["Lun-Sam 11h00-15h00 / 18h00-22h00"],
    description: "Formules rapides et soignées près de la gare Part-Dieu.",
    phone: "04 78 60 15 46",
    useridsList: ["user-manager-1"],
    createdat: "2023-08-19T09:00:00.000Z",
    updatedat: "2023-08-19T09:00:00.000Z",
  },

  // Nouvelle-Aquitaine
  {
    id: "rest-8",
    name: "GoodFood Bordeaux Saint-Pierre",
    address: {
      lat: 44.8378,
      lng: -0.5715,
      street: "8 Rue du Parlement Sainte-Catherine",
      city: "Bordeaux",
      zipcode: "33000",
      country: "France",
    },
    openinghoursList: ["Lun-Dim 12h00-14h30 / 19h00-23h00"],
    description: "Petits plats du marché dans le quartier Saint-Pierre.",
    phone: "05 56 81 24 33",
    useridsList: ["user-manager-2"],
    createdat: "2023-09-04T09:00:00.000Z",
    updatedat: "2023-09-04T09:00:00.000Z",
  },
  {
    id: "rest-9",
    name: "GoodFood Bordeaux Bastide",
    address: {
      lat: 44.8398,
      lng: -0.556,
      street: "51 Quai des Queyries",
      city: "Bordeaux",
      zipcode: "33100",
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h30-14h30 / 18h30-22h30", "Sam-Dim 12h00-23h00"],
    description: "Vue sur la Garonne, rive droite, cuisine de saison.",
    phone: "05 56 86 40 18",
    useridsList: ["user-manager-2"],
    createdat: "2023-10-27T09:00:00.000Z",
    updatedat: "2023-10-27T09:00:00.000Z",
  },

  // Bourgogne-Franche-Comté
  restaurant("rest-10", "GoodFood Dijon Centre", "5 Rue de la Liberté", "21000", "Dijon", 47.322, 5.0415, "Cuisine bourguignonne au pied du Palais des Ducs.", "03 80 30 12 45"),
  restaurant("rest-11", "GoodFood Besançon Battant", "10 Rue Battant", "25000", "Besançon", 47.238, 6.0243, "Adresse conviviale dans le quartier Battant.", "03 81 82 20 11"),
  restaurant("rest-12", "GoodFood Auxerre Centre", "3 Place de l'Hôtel de Ville", "89000", "Auxerre", 47.7982, 3.5731, "Petite table de quartier au bord de l'Yonne.", "03 86 52 18 09"),

  // Bretagne
  restaurant("rest-13", "GoodFood Rennes Centre", "22 Rue Saint-Michel", "35000", "Rennes", 48.1173, -1.6778, "Cuisine bretonne dans le centre historique.", "02 99 79 22 14"),
  restaurant("rest-14", "GoodFood Brest Siam", "8 Rue de Siam", "29200", "Brest", 48.3904, -4.4861, "Vue sur la rade, produits de la mer.", "02 98 44 31 07"),
  restaurant("rest-15", "GoodFood Quimper Centre", "15 Rue Kéréon", "29000", "Quimper", 47.996, -4.1026, "Adresse familiale près de la cathédrale.", "02 98 95 10 26"),

  // Centre-Val de Loire
  restaurant("rest-16", "GoodFood Orléans Centre", "4 Rue Royale", "45000", "Orléans", 47.9029, 1.9093, "Cuisine de Loire face à la cathédrale Sainte-Croix.", "02 38 62 14 09"),
  restaurant("rest-17", "GoodFood Tours Plumereau", "9 Place Plumereau", "37000", "Tours", 47.3941, 0.6848, "Terrasse animée dans le vieux Tours.", "02 47 05 22 18"),
  restaurant("rest-18", "GoodFood Blois Centre", "6 Rue du Commerce", "41000", "Blois", 47.5861, 1.3359, "Table de saison au pied du château.", "02 54 78 11 20"),

  // Corse
  restaurant("rest-19", "GoodFood Ajaccio Centre", "12 Cours Napoléon", "20000", "Ajaccio", 41.9192, 8.7386, "Spécialités corses face au golfe.", "04 95 21 33 08"),
  restaurant("rest-20", "GoodFood Bastia Vieux-Port", "5 Quai des Martyrs de la Libération", "20200", "Bastia", 42.6979, 9.4503, "Vue sur le Vieux-Port, cuisine insulaire.", "04 95 31 27 15"),
  restaurant("rest-21", "GoodFood Corte Citadelle", "2 Rue Scoliscia", "20250", "Corte", 42.3059, 9.1502, "Petite table au pied de la citadelle.", "04 95 46 12 04"),

  // Grand Est
  restaurant("rest-22", "GoodFood Strasbourg Petite France", "11 Rue du Bain aux Plantes", "67000", "Strasbourg", 48.5734, 7.7521, "Winstub moderne en Petite France.", "03 88 32 14 27"),
  restaurant("rest-23", "GoodFood Reims Cathédrale", "7 Rue de Vesle", "51100", "Reims", 49.2583, 4.0317, "À deux pas de la cathédrale Notre-Dame.", "03 26 40 18 33"),
  restaurant("rest-24", "GoodFood Metz Centre", "3 Rue Serpenoise", "57000", "Metz", 49.1193, 6.1757, "Cuisine lorraine près de la place Saint-Louis.", "03 87 36 22 10"),

  // Hauts-de-France
  restaurant("rest-25", "GoodFood Lille Vieux-Lille", "14 Rue de la Monnaie", "59000", "Lille", 50.6292, 3.0573, "Estaminet moderne dans le Vieux-Lille.", "03 20 55 14 09"),
  restaurant("rest-26", "GoodFood Amiens Saint-Leu", "6 Rue Motte", "80000", "Amiens", 49.8941, 2.2958, "Terrasse au bord de l'eau, quartier Saint-Leu.", "03 22 91 20 15"),
  restaurant("rest-27", "GoodFood Roubaix Centre", "9 Grand Place", "59100", "Roubaix", 50.6942, 3.1746, "Cuisine généreuse en cœur de ville.", "03 20 70 11 22"),

  // Normandie
  restaurant("rest-28", "GoodFood Rouen Gros-Horloge", "18 Rue du Gros-Horloge", "76000", "Rouen", 49.4431, 1.0993, "Adresse normande sous la Grosse-Horloge.", "02 35 71 22 14"),
  restaurant("rest-29", "GoodFood Caen Centre", "5 Rue Saint-Pierre", "14000", "Caen", 49.1829, -0.3707, "Cuisine normande près du château.", "02 31 85 14 09"),
  restaurant("rest-30", "GoodFood Le Havre Perret", "10 Avenue Foch", "76600", "Le Havre", 49.4938, 0.1077, "Table de bord de mer, quartier Perret.", "02 35 22 10 18"),

  // Occitanie
  restaurant("rest-31", "GoodFood Toulouse Capitole", "20 Rue Saint-Rome", "31000", "Toulouse", 43.6047, 1.4442, "Cuisine toulousaine à deux pas du Capitole.", "05 61 21 14 09"),
  restaurant("rest-32", "GoodFood Montpellier Comédie", "8 Rue de la Loge", "34000", "Montpellier", 43.6108, 3.8767, "Table méditerranéenne près de la Comédie.", "04 67 60 22 11"),
  restaurant("rest-33", "GoodFood Nîmes Arènes", "4 Boulevard Victor Hugo", "30000", "Nîmes", 43.8367, 4.3601, "Cuisine du sud face aux Arènes.", "04 66 21 18 07"),

  // Pays de la Loire
  restaurant("rest-34", "GoodFood Nantes Bouffay", "13 Rue de la Juiverie", "44000", "Nantes", 47.2184, -1.5536, "Cuisine nantaise dans le quartier du Bouffay.", "02 40 47 22 15"),
  restaurant("rest-35", "GoodFood Angers Centre", "6 Rue Saint-Laud", "49000", "Angers", 47.4784, -0.5632, "Adresse conviviale près du château.", "02 41 87 14 09"),
  restaurant("rest-36", "GoodFood Le Mans Cité Plantagenêt", "9 Grande Rue", "72000", "Le Mans", 48.0061, 0.1996, "Table de saison dans la cité médiévale.", "02 43 24 11 20"),

  // Provence-Alpes-Côte d'Azur
  restaurant("rest-37", "GoodFood Marseille Vieux-Port", "16 Quai du Port", "13001", "Marseille", 43.2965, 5.3698, "Vue sur le Vieux-Port, cuisine provençale.", "04 91 90 22 14"),
  restaurant("rest-38", "GoodFood Nice Vieux-Nice", "7 Rue Droite", "06000", "Nice", 43.7102, 7.262, "Cuisine niçoise dans les ruelles du Vieux-Nice.", "04 93 85 14 09"),
  restaurant("rest-39", "GoodFood Aix-en-Provence Mazarin", "11 Rue du 4 Septembre", "13100", "Aix-en-Provence", 43.5297, 5.4474, "Table de saison dans le quartier Mazarin.", "04 42 38 22 11"),
];

export const categories: Category[] = [
  { id: "cat-1", libelle: "Entrée", hexaColor: "#FDE8E8", icon: "🥗" },
  { id: "cat-2", libelle: "Plat", hexaColor: "#E8F0FD", icon: "🍽️" },
  { id: "cat-3", libelle: "Dessert", hexaColor: "#FDE8F6", icon: "🍰" },
  { id: "cat-4", libelle: "Boisson", hexaColor: "#E8FDF2", icon: "🥤" },
  { id: "cat-5", libelle: "Snack", hexaColor: "#FDF6E8", icon: "🍟" },
  { id: "cat-6", libelle: "Extra", hexaColor: "#EDEDED", icon: "➕" },
];

export const allergens: Allergen[] = [
  { id: "alg-1", libelle: "Gluten" },
  { id: "alg-2", libelle: "Crustacés" },
  { id: "alg-3", libelle: "Œufs" },
  { id: "alg-4", libelle: "Poisson" },
  { id: "alg-5", libelle: "Arachides" },
  { id: "alg-6", libelle: "Soja" },
  { id: "alg-7", libelle: "Lait" },
  { id: "alg-8", libelle: "Fruits à coque" },
];

const cat = (libelle: string) => categories.find((c) => c.libelle === libelle)!;
const alg = (libelle: string) => allergens.find((a) => a.libelle === libelle)!;

const product = (
  id: string,
  restaurantId: string,
  name: string,
  price: number,
  preparation: string,
  weight: string,
  kilocalories: string,
  nutriscore: string,
  type: ProductType,
  image: string,
  comment: string,
  categoryLibelles: string[],
  allergenLibelles: string[],
  isOutOfStock = false,
): Product => ({
  id,
  name,
  image,
  comment,
  price,
  preparation,
  weight,
  kilocalories,
  nutriscore,
  type,
  restaurantId,
  isOutOfStock,
  categoriesList: categoryLibelles.map(cat),
  allergensList: allergenLibelles.map(alg),
  recipeList: [],
});

export const products: Product[] = [
  // GoodFood Paris Bastille
  product(
    "prod-1-1",
    "rest-1",
    "Salade César maison",
    7.9,
    "15 min",
    "320g",
    "410 kcal",
    "B",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Romaine croquante, poulet grillé, parmesan et croûtons faits maison.",
    ["Entrée"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-1-2",
    "rest-1",
    "Bœuf bourguignon",
    14.9,
    "25 min",
    "450g",
    "620 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Mijoté longuement au vin rouge, carottes et champignons, pommes vapeur.",
    ["Plat"],
    [],
  ),
  product(
    "prod-1-3",
    "rest-1",
    "Croque-monsieur gourmand",
    8.9,
    "10 min",
    "300g",
    "480 kcal",
    "D",
    ProductType.PLATS,
    "/images/tmp/big-sandwich.jpeg",
    "Jambon blanc, béchamel maison et comté gratiné, salade verte.",
    ["Plat"],
    ["Gluten", "Lait"],
    true,
  ),
  product(
    "prod-1-4",
    "rest-1",
    "Tarte Tatin",
    6.5,
    "5 min",
    "180g",
    "320 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Pommes caramélisées, pâte feuilletée croustillante.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-1-5",
    "rest-1",
    "Limonade artisanale",
    3.5,
    "0 min",
    "330g",
    "120 kcal",
    "C",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Limonade pétillante brassée en Île-de-France.",
    ["Boisson"],
    [],
  ),
  product(
    "prod-1-6",
    "rest-1",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Lyon Presqu'île
  product(
    "prod-2-1",
    "rest-2",
    "Velouté de potiron",
    5.5,
    "10 min",
    "280g",
    "190 kcal",
    "A",
    ProductType.ENTREES,
    "/images/tmp/bread.jpeg",
    "Potiron rôti, crème fraîche et noisettes torréfiées.",
    ["Entrée"],
    ["Lait", "Fruits à coque"],
  ),
  product(
    "prod-2-2",
    "rest-2",
    "Poulet rôti et frites maison",
    12.5,
    "20 min",
    "480g",
    "700 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/pork.png",
    "Poulet fermier rôti au thym, frites fraîches coupées main.",
    ["Plat"],
    [],
  ),
  product(
    "prod-2-3",
    "rest-2",
    "Quiche lorraine et salade verte",
    10.9,
    "15 min",
    "400g",
    "540 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/wich.png",
    "Recette traditionnelle, lardons fumés et crème fraîche.",
    ["Plat"],
    ["Gluten", "Œufs", "Lait"],
    true,
  ),
  product(
    "prod-2-4",
    "rest-2",
    "Crème brûlée",
    6.9,
    "5 min",
    "150g",
    "350 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Crème vanille et fine croûte de caramel craquant.",
    ["Dessert"],
    ["Œufs", "Lait"],
  ),
  product(
    "prod-2-5",
    "rest-2",
    "Café gourmand",
    4.5,
    "3 min",
    "100g",
    "90 kcal",
    "B",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Café et trois mignardises maison.",
    ["Boisson"],
    ["Lait"],
  ),
  product(
    "prod-2-6",
    "rest-2",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Bordeaux Chartrons
  product(
    "prod-3-1",
    "rest-3",
    "Salade César maison",
    7.9,
    "15 min",
    "320g",
    "410 kcal",
    "B",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Romaine croquante, poulet grillé, parmesan et croûtons faits maison.",
    ["Entrée"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-3-2",
    "rest-3",
    "Moules-frites",
    15.9,
    "20 min",
    "500g",
    "610 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Moules de bouchot marinière, frites fraîches coupées main.",
    ["Plat"],
    ["Crustacés", "Lait"],
  ),
  product(
    "prod-3-3",
    "rest-3",
    "Ratatouille et riz basmati",
    11.5,
    "20 min",
    "420g",
    "380 kcal",
    "A",
    ProductType.PLATS,
    "/images/tmp/pork.png",
    "Légumes du soleil mijotés, riz basmati parfumé.",
    ["Plat"],
    [],
    true,
  ),
  product(
    "prod-3-4",
    "rest-3",
    "Mousse au chocolat",
    5.9,
    "5 min",
    "140g",
    "300 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Chocolat noir 70%, texture aérienne.",
    ["Dessert"],
    ["Œufs", "Lait"],
  ),
  product(
    "prod-3-5",
    "rest-3",
    "Jus de raisin local",
    3.9,
    "0 min",
    "330g",
    "150 kcal",
    "C",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Jus de raisin pressé, vignoble bordelais.",
    ["Boisson"],
    [],
  ),
  product(
    "prod-3-6",
    "rest-3",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Paris Montmartre
  product(
    "prod-4-1",
    "rest-4",
    "Œuf mimosa revisité",
    6.9,
    "10 min",
    "220g",
    "280 kcal",
    "B",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Œufs fermiers, mayonnaise maison et ciboulette.",
    ["Entrée"],
    ["Œufs"],
  ),
  product(
    "prod-4-2",
    "rest-4",
    "Hachis parmentier de canard",
    13.9,
    "20 min",
    "440g",
    "590 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Confit de canard effiloché, purée maison gratinée.",
    ["Plat"],
    ["Lait"],
  ),
  product(
    "prod-4-3",
    "rest-4",
    "Paris-Brest",
    6.5,
    "5 min",
    "160g",
    "410 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Pâte à choux, praliné noisette et amandes torréfiées.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait", "Fruits à coque"],
  ),
  product(
    "prod-4-4",
    "rest-4",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Paris Marais
  product(
    "prod-5-1",
    "rest-5",
    "Burrata et tomates anciennes",
    9.9,
    "10 min",
    "260g",
    "350 kcal",
    "B",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Burrata crémeuse, tomates de saison, huile d'olive.",
    ["Entrée"],
    ["Lait"],
  ),
  product(
    "prod-5-2",
    "rest-5",
    "Falafels et houmous maison",
    11.9,
    "15 min",
    "400g",
    "520 kcal",
    "B",
    ProductType.PLATS,
    "/images/tmp/pork.png",
    "Falafels croustillants, houmous, taboulé et pain pita.",
    ["Plat"],
    ["Gluten"],
  ),
  product(
    "prod-5-3",
    "rest-5",
    "Cheesecake New-Yorkais",
    6.9,
    "5 min",
    "170g",
    "430 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Base sablée, cheesecake vanille, coulis de fruits rouges.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-5-4",
    "rest-5",
    "Thé glacé maison",
    3.9,
    "0 min",
    "330g",
    "90 kcal",
    "B",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Thé noir infusé à froid, citron et menthe.",
    ["Boisson"],
    [],
  ),

  // GoodFood Lyon Croix-Rousse
  product(
    "prod-6-1",
    "rest-6",
    "Salade lyonnaise",
    8.5,
    "10 min",
    "300g",
    "390 kcal",
    "B",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Frisée, lardons, œuf poché et croûtons.",
    ["Entrée"],
    ["Gluten", "Œufs"],
  ),
  product(
    "prod-6-2",
    "rest-6",
    "Quenelle de brochet sauce Nantua",
    14.5,
    "20 min",
    "420g",
    "560 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Quenelle maison, sauce Nantua aux écrevisses.",
    ["Plat"],
    ["Crustacés", "Gluten", "Lait"],
  ),
  product(
    "prod-6-3",
    "rest-6",
    "Tarte aux pralines",
    6.5,
    "5 min",
    "160g",
    "440 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Pralines roses de Lyon, pâte sablée maison.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-6-4",
    "rest-6",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Lyon Part-Dieu
  product(
    "prod-7-1",
    "rest-7",
    "Soupe à l'oignon gratinée",
    6.9,
    "15 min",
    "320g",
    "380 kcal",
    "C",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Oignons caramélisés, croûtons et comté gratiné.",
    ["Entrée"],
    ["Gluten", "Lait"],
  ),
  product(
    "prod-7-2",
    "rest-7",
    "Poke bowl saumon",
    13.5,
    "10 min",
    "450g",
    "540 kcal",
    "B",
    ProductType.PLATS,
    "/images/tmp/pork.png",
    "Saumon mariné, riz vinaigré, edamame et avocat.",
    ["Plat"],
    ["Poisson", "Soja"],
  ),
  product(
    "prod-7-3",
    "rest-7",
    "Fondant au chocolat",
    5.9,
    "5 min",
    "140g",
    "410 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Cœur coulant, chocolat noir 70%.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-7-4",
    "rest-7",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Bordeaux Saint-Pierre
  product(
    "prod-8-1",
    "rest-8",
    "Terrine de campagne maison",
    7.5,
    "5 min",
    "200g",
    "360 kcal",
    "C",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Terrine de porc, pain grillé et pickles.",
    ["Entrée"],
    ["Gluten"],
  ),
  product(
    "prod-8-2",
    "rest-8",
    "Magret de canard aux cèpes",
    16.9,
    "25 min",
    "460g",
    "640 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Magret rosé, poêlée de cèpes et pommes sarladaises.",
    ["Plat"],
    [],
  ),
  product(
    "prod-8-3",
    "rest-8",
    "Cannelé bordelais",
    3.9,
    "0 min",
    "80g",
    "220 kcal",
    "D",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Cannelé artisanal, rhum et vanille.",
    ["Dessert"],
    ["Gluten", "Œufs", "Lait"],
  ),
  product(
    "prod-8-4",
    "rest-8",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),

  // GoodFood Bordeaux Bastide
  product(
    "prod-9-1",
    "rest-9",
    "Huîtres du Bassin d'Arcachon",
    12.9,
    "5 min",
    "250g",
    "150 kcal",
    "A",
    ProductType.ENTREES,
    "/images/tmp/wich.png",
    "Six huîtres n°3, échalote et vinaigre balsamique.",
    ["Entrée"],
    ["Crustacés"],
  ),
  product(
    "prod-9-2",
    "rest-9",
    "Entrecôte grillée, frites maison",
    18.5,
    "20 min",
    "480g",
    "700 kcal",
    "C",
    ProductType.PLATS,
    "/images/tmp/big-pork-plate.jpeg",
    "Entrecôte de bœuf grillée, beurre maître d'hôtel.",
    ["Plat"],
    [],
  ),
  product(
    "prod-9-3",
    "rest-9",
    "Tarte aux pommes fine",
    6.0,
    "5 min",
    "170g",
    "340 kcal",
    "C",
    ProductType.DESSERTS,
    "/images/tmp/bread.jpeg",
    "Pommes fines caramélisées, pâte feuilletée maison.",
    ["Dessert"],
    ["Gluten", "Lait"],
  ),
  product(
    "prod-9-4",
    "rest-9",
    "Eau minérale 50cl",
    2.0,
    "0 min",
    "500g",
    "0 kcal",
    "A",
    ProductType.BOISSONS,
    "/images/tmp/utensils.jpeg",
    "Eau minérale naturelle.",
    ["Boisson"],
    [],
  ),
];

// Regional menus for the restaurants added to cover every French metropolitan region (see
// `restaurants` above): one shared entrée/plat/dessert per region, reused by its 3 cities, plus
// the same still water every other restaurant already carries.
type Dish = [
  name: string,
  price: number,
  preparation: string,
  weight: string,
  kilocalories: string,
  nutriscore: string,
  type: ProductType,
  image: string,
  comment: string,
  categoryLibelles: string[],
  allergenLibelles: string[],
];

const water: Dish = [
  "Eau minérale 50cl",
  2.0,
  "0 min",
  "500g",
  "0 kcal",
  "A",
  ProductType.BOISSONS,
  "/images/tmp/utensils.jpeg",
  "Eau minérale naturelle.",
  ["Boisson"],
  [],
];

const regionalMenus: Record<string, Dish[]> = {
  bfc: [
    ["Jambon persillé", 7.5, "10 min", "180g", "320 kcal", "B", ProductType.ENTREES, "/images/tmp/wich.png", "Jambon persillé bourguignon, moutarde à l'ancienne.", ["Entrée"], []],
    ["Coq au vin jaune", 14.9, "25 min", "450g", "610 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Coq mijoté au vin jaune du Jura et morilles.", ["Plat"], []],
    ["Pain d'épices et miel", 5.5, "5 min", "140g", "320 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Pain d'épices artisanal, miel de Bourgogne.", ["Dessert"], ["Gluten", "Œufs"]],
    water,
  ],
  bretagne: [
    ["Terrine de sardines", 7.5, "10 min", "180g", "280 kcal", "B", ProductType.ENTREES, "/images/tmp/wich.png", "Terrine de sardines bretonnes, pain grillé.", ["Entrée"], ["Poisson", "Gluten"]],
    ["Galette complète", 11.5, "15 min", "380g", "520 kcal", "C", ProductType.PLATS, "/images/tmp/big-sandwich.jpeg", "Galette de sarrasin, jambon, œuf et emmental.", ["Plat"], ["Œufs", "Lait"]],
    ["Kouign-amann", 5.9, "5 min", "150g", "460 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Pâte feuilletée au beurre salé et sucre caramélisé.", ["Dessert"], ["Gluten", "Lait"]],
    water,
  ],
  cvl: [
    ["Rillettes de Tours", 7.5, "5 min", "160g", "340 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Rillettes de Tours, cornichons et pain de campagne.", ["Entrée"], ["Gluten"]],
    ["Fricassée de volaille tourangelle", 14.5, "25 min", "440g", "580 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Volaille fermière, champignons de Paris et crème.", ["Plat"], ["Lait"]],
    ["Poire pochée au vin de Loire", 6.0, "10 min", "160g", "260 kcal", "C", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Poire pochée au vin rouge de Loire et épices.", ["Dessert"], []],
    water,
  ],
  corse: [
    ["Charcuterie corse et brocciu", 9.5, "5 min", "200g", "380 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Coppa, lonzu et brocciu fermier.", ["Entrée"], ["Lait"]],
    ["Civet de sanglier", 16.9, "30 min", "460g", "650 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Sanglier mijoté au vin rouge et châtaignes.", ["Plat"], []],
    ["Fiadone", 6.5, "5 min", "150g", "340 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Gâteau au brocciu et zestes de citron.", ["Dessert"], ["Œufs", "Lait"]],
    water,
  ],
  grandest: [
    ["Tarte flambée", 8.5, "15 min", "220g", "400 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Crème fraîche, oignons et lardons fumés.", ["Entrée"], ["Gluten", "Lait"]],
    ["Choucroute royale", 15.9, "25 min", "500g", "720 kcal", "D", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Choucroute alsacienne, charcuteries et pommes de terre.", ["Plat"], []],
    ["Kougelhopf", 5.9, "5 min", "150g", "380 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Brioche alsacienne aux raisins et amandes.", ["Dessert"], ["Gluten", "Œufs", "Lait", "Fruits à coque"]],
    water,
  ],
  hdf: [
    ["Flamiche aux poireaux", 7.9, "15 min", "200g", "340 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Tarte salée aux poireaux et crème fraîche.", ["Entrée"], ["Gluten", "Lait"]],
    ["Carbonade flamande", 13.9, "25 min", "440g", "590 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Bœuf mijoté à la bière brune et pain d'épices.", ["Plat"], ["Gluten"]],
    ["Gaufre de Lille", 4.9, "5 min", "120g", "380 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Gaufre fourrée à la vergeoise.", ["Dessert"], ["Gluten", "Œufs", "Lait"]],
    water,
  ],
  normandie: [
    ["Terrine de campagne normande", 7.5, "5 min", "190g", "350 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Terrine de porc, calvados et pain grillé.", ["Entrée"], ["Gluten"]],
    ["Poulet vallée d'Auge", 14.5, "25 min", "450g", "610 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Poulet fermier, crème et pommes flambées au calvados.", ["Plat"], ["Lait"]],
    ["Teurgoule normande", 5.5, "10 min", "180g", "300 kcal", "C", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Riz au lait mijoté à la cannelle, cuisson longue.", ["Dessert"], ["Lait"]],
    water,
  ],
  occitanie: [
    ["Salade toulousaine", 7.9, "10 min", "260g", "360 kcal", "B", ProductType.ENTREES, "/images/tmp/wich.png", "Gésiers confits, magret fumé et croûtons.", ["Entrée"], ["Gluten"]],
    ["Cassoulet toulousain", 15.5, "30 min", "500g", "740 kcal", "D", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Haricots blancs, saucisse et confit de canard.", ["Plat"], []],
    ["Croustade aux pommes", 5.9, "5 min", "160g", "350 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Pommes et pruneaux, pâte croustillante à l'armagnac.", ["Dessert"], ["Gluten"]],
    water,
  ],
  pdl: [
    ["Rillettes du Mans", 7.5, "5 min", "160g", "330 kcal", "C", ProductType.ENTREES, "/images/tmp/wich.png", "Rillettes du Mans, cornichons et pain de campagne.", ["Entrée"], ["Gluten"]],
    ["Sandre au beurre blanc", 16.5, "20 min", "420g", "560 kcal", "C", ProductType.PLATS, "/images/tmp/pork.png", "Filet de sandre, sauce beurre blanc nantaise.", ["Plat"], ["Poisson", "Lait"]],
    ["Gâteau nantais", 5.9, "5 min", "150g", "400 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Gâteau moelleux aux amandes et rhum.", ["Dessert"], ["Gluten", "Œufs", "Fruits à coque"]],
    water,
  ],
  paca: [
    ["Petits farcis niçois", 8.5, "15 min", "220g", "310 kcal", "B", ProductType.ENTREES, "/images/tmp/wich.png", "Légumes farcis à la niçoise.", ["Entrée"], []],
    ["Daube provençale", 15.9, "30 min", "460g", "620 kcal", "C", ProductType.PLATS, "/images/tmp/big-pork-plate.jpeg", "Bœuf mijoté au vin rouge, olives et herbes de Provence.", ["Plat"], []],
    ["Calisson d'Aix", 4.9, "0 min", "100g", "380 kcal", "D", ProductType.DESSERTS, "/images/tmp/bread.jpeg", "Pâte d'amande et fruits confits, glaçage royal.", ["Dessert"], ["Fruits à coque"]],
    water,
  ],
};

const regionalRestaurantIds: Record<string, string[]> = {
  bfc: ["rest-10", "rest-11", "rest-12"],
  bretagne: ["rest-13", "rest-14", "rest-15"],
  cvl: ["rest-16", "rest-17", "rest-18"],
  corse: ["rest-19", "rest-20", "rest-21"],
  grandest: ["rest-22", "rest-23", "rest-24"],
  hdf: ["rest-25", "rest-26", "rest-27"],
  normandie: ["rest-28", "rest-29", "rest-30"],
  occitanie: ["rest-31", "rest-32", "rest-33"],
  pdl: ["rest-34", "rest-35", "rest-36"],
  paca: ["rest-37", "rest-38", "rest-39"],
};

const regionalProducts: Product[] = Object.entries(regionalRestaurantIds).flatMap(([region, restaurantIds]) =>
  restaurantIds.flatMap((restaurantId) =>
    regionalMenus[region].map((dish, i) => product(`prod-${restaurantId.slice(5)}-${i + 1}`, restaurantId, ...dish)),
  ),
);

products.push(...regionalProducts);

export const promotions: Promotion[] = [
  { id: "promo-1", code: "BASTILLE10", reduction: 10, method: "PERCENTAGE", restaurantId: "rest-1" },
  { id: "promo-2", code: "LYON15", reduction: 15, method: "PERCENTAGE", restaurantId: "rest-2" },
  { id: "promo-3", code: "BORDEAUX20", reduction: 20, method: "PERCENTAGE", restaurantId: "rest-3" },
];

export const suppliers: Supplier[] = [
  { id: 1, name: "Rungis Distribution", contact: "01 45 12 34 56" },
  { id: 2, name: "Metro Restauration", contact: "01 45 98 76 54" },
  { id: 3, name: "Fromagerie Lefèvre", contact: "03 80 22 11 09" },
  { id: 4, name: "Primeur des Halles", contact: "05 56 44 33 22" },
];

export const ingredients: Ingredient[] = [
  { id: 1, name: "Tomate", description: "Tomate ronde fraîche" },
  { id: 2, name: "Mozzarella", description: "Mozzarella di bufala" },
  { id: 3, name: "Farine T55", description: "Farine de blé tendre" },
  { id: 4, name: "Beurre AOP", description: "Beurre doux Charentes-Poitou" },
  { id: 5, name: "Poulet fermier", description: "Poulet fermier élevé en plein air" },
  { id: 6, name: "Riz basmati", description: "Riz basmati parfumé" },
  { id: 7, name: "Crème fraîche", description: "Crème fraîche épaisse 30%" },
  { id: 8, name: "Oignon jaune", description: "Oignon jaune de garde" },
  { id: 9, name: "Pomme de terre", description: "Pomme de terre à chair ferme" },
  { id: 10, name: "Saumon frais", description: "Filet de saumon frais" },
];

export type FlatIngredientRestaurant = Omit<IngredientRestaurant, "ingredient" | "supplier">;
export type FlatSupplyOrder = Omit<SupplyOrder, "ingredientRestaurant" | "supplier">;

export const ingredientRestaurants: FlatIngredientRestaurant[] = [
  { id: 1, key: "rest-1-1", alertThreshold: 10, quantity: 42, inProductListList: [], unitPrice: 0.4, pricePerKilo: 1.2, restaurantId: "rest-1", ingredientId: 1, supplierId: 1, updatedAt: "2024-05-01T08:00:00.000Z" },
  { id: 2, key: "rest-1-2", alertThreshold: 8, quantity: 25, inProductListList: [], unitPrice: 1.8, pricePerKilo: 9.0, restaurantId: "rest-1", ingredientId: 2, supplierId: 3, updatedAt: "2024-05-01T08:00:00.000Z" },
  { id: 3, key: "rest-1-3", alertThreshold: 20, quantity: 60, inProductListList: [], unitPrice: 0.9, pricePerKilo: 0.9, restaurantId: "rest-1", ingredientId: 3, supplierId: 2, updatedAt: "2024-05-01T08:00:00.000Z" },
  { id: 4, key: "rest-1-4", alertThreshold: 6, quantity: 18, inProductListList: [], unitPrice: 3.2, pricePerKilo: 12.0, restaurantId: "rest-1", ingredientId: 4, supplierId: 3, updatedAt: "2024-05-01T08:00:00.000Z" },
  { id: 5, key: "rest-1-5", alertThreshold: 12, quantity: 30, inProductListList: [], unitPrice: 4.5, pricePerKilo: 6.5, restaurantId: "rest-1", ingredientId: 5, supplierId: 1, updatedAt: "2024-05-01T08:00:00.000Z" },

  { id: 6, key: "rest-2-3", alertThreshold: 20, quantity: 5, inProductListList: [], unitPrice: 0.9, pricePerKilo: 0.9, restaurantId: "rest-2", ingredientId: 3, supplierId: 2, updatedAt: "2024-05-02T08:00:00.000Z" },
  { id: 7, key: "rest-2-4", alertThreshold: 6, quantity: 22, inProductListList: [], unitPrice: 3.2, pricePerKilo: 12.0, restaurantId: "rest-2", ingredientId: 4, supplierId: 3, updatedAt: "2024-05-02T08:00:00.000Z" },
  { id: 8, key: "rest-2-5", alertThreshold: 12, quantity: 40, inProductListList: [], unitPrice: 4.5, pricePerKilo: 6.5, restaurantId: "rest-2", ingredientId: 5, supplierId: 1, updatedAt: "2024-05-02T08:00:00.000Z" },
  { id: 9, key: "rest-2-6", alertThreshold: 10, quantity: 35, inProductListList: [], unitPrice: 2.1, pricePerKilo: 2.1, restaurantId: "rest-2", ingredientId: 6, supplierId: 2, updatedAt: "2024-05-02T08:00:00.000Z" },
  { id: 10, key: "rest-2-7", alertThreshold: 8, quantity: 3, inProductListList: [], unitPrice: 2.6, pricePerKilo: 2.6, restaurantId: "rest-2", ingredientId: 7, supplierId: 3, updatedAt: "2024-05-02T08:00:00.000Z" },

  { id: 11, key: "rest-3-6", alertThreshold: 10, quantity: 28, inProductListList: [], unitPrice: 2.1, pricePerKilo: 2.1, restaurantId: "rest-3", ingredientId: 6, supplierId: 2, updatedAt: "2024-05-03T08:00:00.000Z" },
  { id: 12, key: "rest-3-7", alertThreshold: 8, quantity: 24, inProductListList: [], unitPrice: 2.6, pricePerKilo: 2.6, restaurantId: "rest-3", ingredientId: 7, supplierId: 3, updatedAt: "2024-05-03T08:00:00.000Z" },
  { id: 13, key: "rest-3-8", alertThreshold: 15, quantity: 50, inProductListList: [], unitPrice: 0.3, pricePerKilo: 0.9, restaurantId: "rest-3", ingredientId: 8, supplierId: 4, updatedAt: "2024-05-03T08:00:00.000Z" },
  { id: 14, key: "rest-3-9", alertThreshold: 20, quantity: 4, inProductListList: [], unitPrice: 0.5, pricePerKilo: 1.1, restaurantId: "rest-3", ingredientId: 9, supplierId: 4, updatedAt: "2024-05-03T08:00:00.000Z" },
  { id: 15, key: "rest-3-10", alertThreshold: 6, quantity: 15, inProductListList: [], unitPrice: 6.9, pricePerKilo: 22.0, restaurantId: "rest-3", ingredientId: 10, supplierId: 1, updatedAt: "2024-05-03T08:00:00.000Z" },
];

export const supplyOrders: FlatSupplyOrder[] = [
  { id: 1, quantity: 50, unitPrice: 0.4, ingredientRestaurantId: 1, supplierId: 1, createdAt: "2024-04-20T08:00:00.000Z", updatedAt: "2024-04-20T08:00:00.000Z" },
  { id: 2, quantity: 20, unitPrice: 1.8, ingredientRestaurantId: 2, supplierId: 3, createdAt: "2024-04-22T08:00:00.000Z", updatedAt: "2024-04-22T08:00:00.000Z" },
  { id: 3, quantity: 30, unitPrice: 0.9, ingredientRestaurantId: 6, supplierId: 2, createdAt: "2024-04-25T08:00:00.000Z", updatedAt: "2024-04-25T08:00:00.000Z" },
  { id: 4, quantity: 15, unitPrice: 2.6, ingredientRestaurantId: 10, supplierId: 3, createdAt: "2024-04-28T08:00:00.000Z", updatedAt: "2024-04-28T08:00:00.000Z" },
  { id: 5, quantity: 40, unitPrice: 0.3, ingredientRestaurantId: 13, supplierId: 4, createdAt: "2024-05-01T08:00:00.000Z", updatedAt: "2024-05-01T08:00:00.000Z" },
  { id: 6, quantity: 10, unitPrice: 6.9, ingredientRestaurantId: 15, supplierId: 1, createdAt: "2024-05-03T08:00:00.000Z", updatedAt: "2024-05-03T08:00:00.000Z" },
];

export const deliveryPersons: DeliveryPerson[] = [
  { id: "user-delivery", firstName: "Dan", lastName: "Morel", phone: "0600000004", address: users.find((u) => u.id === "user-delivery")!.mainaddress },
];

type FlatPayment = Omit<Payment, "user">;
type FlatDelivery = Omit<Delivery, "deliveryPerson">;
// The frontend's Order type only carries embedded user/payment/delivery objects (no *Id
// foreign keys besides paymentId/deliveryId); the mock store needs a userId to join on.
type FlatOrder = Omit<Order, "user" | "payment" | "delivery"> & { userId: string };

export const payments: FlatPayment[] = [
  { id: "payment-1", stripe_id: "pi_mock_1", total: 26.8, status: PaymentStatus.APPROVED, user_id: "user-customer", created_at: "2024-06-01T11:30:00.000Z", updated_at: "2024-06-01T11:30:00.000Z" },
  { id: "payment-2", stripe_id: "pi_mock_2", total: 21.9, status: PaymentStatus.APPROVED, user_id: "user-customer", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "payment-3", stripe_id: "pi_mock_3", total: 14.4, status: PaymentStatus.REJECTED, user_id: "user-customer", created_at: "2024-05-20T19:15:00.000Z", updated_at: "2024-05-20T19:15:00.000Z" },
  { id: "payment-4", stripe_id: "pi_mock_4", total: 32.3, status: PaymentStatus.APPROVED, user_id: "user-customer-2", created_at: "2024-06-05T12:00:00.000Z", updated_at: "2024-06-05T12:00:00.000Z" },
  { id: "payment-5", stripe_id: "pi_mock_5", total: 13.5, status: PaymentStatus.APPROVED, user_id: "user-customer", created_at: "2024-04-12T12:30:00.000Z", updated_at: "2024-04-12T12:30:00.000Z" },
  { id: "payment-6", stripe_id: "pi_mock_6", total: 21.8, status: PaymentStatus.APPROVED, user_id: "user-customer", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "payment-7", stripe_id: "pi_mock_7", total: 15.5, status: PaymentStatus.APPROVED, user_id: "user-customer", created_at: "2024-04-28T19:30:00.000Z", updated_at: "2024-04-28T19:30:00.000Z" },
  { id: "payment-8", stripe_id: "pi_mock_8", total: 24.4, status: PaymentStatus.PENDING, user_id: "user-customer", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "payment-9", stripe_id: "pi_mock_9", total: 20.5, status: PaymentStatus.REJECTED, user_id: "user-customer", created_at: "2024-03-30T13:10:00.000Z", updated_at: "2024-03-30T13:10:00.000Z" },
  { id: "payment-10", stripe_id: "pi_mock_10", total: 23.4, status: PaymentStatus.APPROVED, user_id: "user-customer-2", created_at: "2024-04-15T20:00:00.000Z", updated_at: "2024-04-15T20:00:00.000Z" },
  { id: "payment-11", stripe_id: "pi_mock_11", total: 13.9, status: PaymentStatus.APPROVED, user_id: "user-customer-2", created_at: "2024-05-02T12:45:00.000Z", updated_at: "2024-05-02T12:45:00.000Z" },
  { id: "payment-12", stripe_id: "pi_mock_12", total: 16.5, status: PaymentStatus.APPROVED, user_id: "user-customer-2", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "payment-13", stripe_id: "pi_mock_13", total: 22.4, status: PaymentStatus.REJECTED, user_id: "user-customer-2", created_at: "2024-03-18T18:20:00.000Z", updated_at: "2024-03-18T18:20:00.000Z" },
  { id: "payment-14", stripe_id: "pi_mock_14", total: 22.4, status: PaymentStatus.APPROVED, user_id: "user-customer-2", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const deliveries: FlatDelivery[] = [
  { id: "delivery-1", eta: "2024-06-01T12:15:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-1" },
  { id: "delivery-2", eta: new Date(Date.now() + 25 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.PENDING, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-2" },
  { id: "delivery-3", eta: "2024-05-20T19:45:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.REJECTED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-1" },
  { id: "delivery-4", eta: new Date(Date.now() - 60 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.IN_PROGRESS, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-3" },
  { id: "delivery-5", eta: "2024-04-12T13:15:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-13" },
  { id: "delivery-6", eta: new Date(Date.now() + 40 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.IN_PROGRESS, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-22" },
  { id: "delivery-7", eta: "2024-04-28T20:00:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-31" },
  { id: "delivery-8", eta: new Date(Date.now() + 35 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.PENDING, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-37" },
  { id: "delivery-9", eta: "2024-03-30T13:45:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.REJECTED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-16" },
  { id: "delivery-10", eta: "2024-04-15T20:40:00.000Z", address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-19" },
  { id: "delivery-11", eta: "2024-05-02T13:20:00.000Z", address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-25" },
  { id: "delivery-12", eta: new Date(Date.now() + 20 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.PENDING, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-28" },
  { id: "delivery-13", eta: "2024-03-18T18:55:00.000Z", address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.REJECTED, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-34" },
  { id: "delivery-14", eta: new Date(Date.now() + 10 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.IN_PROGRESS, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-10" },
];

const basketSnapshotFor = (restaurantId: string, items: { id: string; quantity: number }[]): BasketSnapshot => ({
  restaurantId,
  productsList: items.map(({ id, quantity }) => {
    const p = products.find((pr) => pr.id === id)!;
    return { id, quantity, price: p.price, name: p.name };
  }),
});

const toBasketSnapshotJson = (snapshot: BasketSnapshot, total: number): Order["basketSnapshot"] => ({
  string: JSON.stringify(snapshot),
  json: snapshot,
  total,
});

export const orders: FlatOrder[] = [
  {
    id: "order-1",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-1",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-1", [
        { id: "prod-1-1", quantity: 1 },
        { id: "prod-1-2", quantity: 1 },
      ]),
      26.8,
    ),
    status: Status.FULFILLED,
    paymentId: "payment-1",
    deliveryId: "delivery-1",
    created_at: "2024-06-01T11:20:00.000Z",
    updated_at: "2024-06-01T12:15:00.000Z",
  },
  {
    id: "order-2",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-2",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-2", [
        { id: "prod-2-2", quantity: 1 },
        { id: "prod-2-4", quantity: 1 },
      ]),
      21.9,
    ),
    status: Status.PENDING,
    paymentId: "payment-2",
    deliveryId: "delivery-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "order-3",
    deliveryType: DeliveryType.TAKEAWAY,
    restaurantId: "rest-1",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(basketSnapshotFor("rest-1", [{ id: "prod-1-4", quantity: 2 }]), 14.4),
    status: Status.REJECTED,
    paymentId: "payment-3",
    deliveryId: "delivery-3",
    created_at: "2024-05-20T19:00:00.000Z",
    updated_at: "2024-05-20T19:15:00.000Z",
  },
  {
    id: "order-4",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-3",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-3", [
        { id: "prod-3-2", quantity: 2 },
      ]),
      32.3,
    ),
    status: Status.IN_PROGRESS,
    paymentId: "payment-4",
    deliveryId: "delivery-4",
    created_at: "2024-06-05T11:50:00.000Z",
    updated_at: "2024-06-05T12:00:00.000Z",
  },
  {
    id: "order-5",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-13",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-13", [
        { id: "prod-13-2", quantity: 1 },
        { id: "prod-13-4", quantity: 1 },
      ]),
      13.5,
    ),
    status: Status.FULFILLED,
    paymentId: "payment-5",
    deliveryId: "delivery-5",
    created_at: "2024-04-12T12:20:00.000Z",
    updated_at: "2024-04-12T13:15:00.000Z",
  },
  {
    id: "order-6",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-22",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-22", [
        { id: "prod-22-2", quantity: 1 },
        { id: "prod-22-3", quantity: 1 },
      ]),
      21.8,
    ),
    status: Status.IN_PROGRESS,
    paymentId: "payment-6",
    deliveryId: "delivery-6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "order-7",
    deliveryType: DeliveryType.TAKEAWAY,
    restaurantId: "rest-31",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(basketSnapshotFor("rest-31", [{ id: "prod-31-2", quantity: 1 }]), 15.5),
    status: Status.FULFILLED,
    paymentId: "payment-7",
    deliveryId: "delivery-7",
    created_at: "2024-04-28T19:15:00.000Z",
    updated_at: "2024-04-28T20:00:00.000Z",
  },
  {
    id: "order-8",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-37",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-37", [
        { id: "prod-37-1", quantity: 1 },
        { id: "prod-37-2", quantity: 1 },
      ]),
      24.4,
    ),
    status: Status.PENDING,
    paymentId: "payment-8",
    deliveryId: "delivery-8",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "order-9",
    deliveryType: DeliveryType.TAKEAWAY,
    restaurantId: "rest-16",
    userId: "user-customer",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-16", [
        { id: "prod-16-2", quantity: 1 },
        { id: "prod-16-3", quantity: 1 },
      ]),
      20.5,
    ),
    status: Status.REJECTED,
    paymentId: "payment-9",
    deliveryId: "delivery-9",
    created_at: "2024-03-30T12:55:00.000Z",
    updated_at: "2024-03-30T13:10:00.000Z",
  },
  {
    id: "order-10",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-19",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-19", [
        { id: "prod-19-2", quantity: 1 },
        { id: "prod-19-3", quantity: 1 },
      ]),
      23.4,
    ),
    status: Status.FULFILLED,
    paymentId: "payment-10",
    deliveryId: "delivery-10",
    created_at: "2024-04-15T19:45:00.000Z",
    updated_at: "2024-04-15T20:00:00.000Z",
  },
  {
    id: "order-11",
    deliveryType: DeliveryType.TAKEAWAY,
    restaurantId: "rest-25",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(basketSnapshotFor("rest-25", [{ id: "prod-25-2", quantity: 1 }]), 13.9),
    status: Status.FULFILLED,
    paymentId: "payment-11",
    deliveryId: "delivery-11",
    created_at: "2024-05-02T12:30:00.000Z",
    updated_at: "2024-05-02T12:45:00.000Z",
  },
  {
    id: "order-12",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-28",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-28", [
        { id: "prod-28-2", quantity: 1 },
        { id: "prod-28-4", quantity: 1 },
      ]),
      16.5,
    ),
    status: Status.PENDING,
    paymentId: "payment-12",
    deliveryId: "delivery-12",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "order-13",
    deliveryType: DeliveryType.DELIVERY,
    restaurantId: "rest-34",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-34", [
        { id: "prod-34-2", quantity: 1 },
        { id: "prod-34-3", quantity: 1 },
      ]),
      22.4,
    ),
    status: Status.REJECTED,
    paymentId: "payment-13",
    deliveryId: "delivery-13",
    created_at: "2024-03-18T18:05:00.000Z",
    updated_at: "2024-03-18T18:20:00.000Z",
  },
  {
    id: "order-14",
    deliveryType: DeliveryType.TAKEAWAY,
    restaurantId: "rest-10",
    userId: "user-customer-2",
    basketSnapshot: toBasketSnapshotJson(
      basketSnapshotFor("rest-10", [
        { id: "prod-10-1", quantity: 1 },
        { id: "prod-10-2", quantity: 1 },
      ]),
      22.4,
    ),
    status: Status.IN_PROGRESS,
    paymentId: "payment-14",
    deliveryId: "delivery-14",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const baskets = new Map<string, Basket>();

// -- Assemblers: join flat records into the embedded shapes apps/web/types/* expect --

export const findUser = (id?: string) => users.find((u) => u.id === id);

const toPaymentUser = (u: User): PaymentUser => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email });

export const embedPayment = (payment: FlatPayment): Payment => {
  const u = findUser(payment.user_id) ?? users[0];
  return { ...payment, user: toPaymentUser(u) };
};

export const embedDeliveryPerson = (id: string): DeliveryPerson =>
  deliveryPersons.find((d) => d.id === id) ?? deliveryPersons[0];

// There's a single mock delivery person, whose profile address is fixed in Paris — showing that
// on the map for every delivery, everywhere in France, put the courier pin (and the route drawn
// from it) in the wrong place for any restaurant outside Paris. Simulate their current position as
// somewhere near the restaurant they're delivering from instead. The offset is derived from the
// delivery id (not Math.random()) so it stays put across refetches instead of jumping around.
const seededJitter = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return (((hash % 1000) + 1000) % 1000) / 1000 / 100 - 0.005; // ~±550m
};

export const embedDelivery = (delivery: FlatDelivery): Delivery => {
  const restaurant = restaurants.find((r) => r.id === delivery.restaurant_id);
  const deliveryPerson = embedDeliveryPerson(delivery.delivery_person_id);
  return {
    ...delivery,
    deliveryPerson: restaurant
      ? {
          ...deliveryPerson,
          address: {
            ...restaurant.address,
            lat: restaurant.address.lat + seededJitter(delivery.id),
            lng: restaurant.address.lng + seededJitter(`${delivery.id}-lng`),
          },
        }
      : deliveryPerson,
  };
};

export const embedOrder = (order: FlatOrder): Order => {
  const u = findUser(order.userId) ?? users[0];
  const payment = payments.find((p) => p.id === order.paymentId);
  const delivery = deliveries.find((d) => d.id === order.deliveryId);
  return {
    ...order,
    user: { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone },
    payment: payment ? embedPayment(payment) : undefined,
    delivery: delivery ? embedDelivery(delivery) : undefined,
  } as Order;
};

export const embedIngredientRestaurant = (ir: FlatIngredientRestaurant): IngredientRestaurant => ({
  ...ir,
  ingredient: ingredients.find((i) => i.id === ir.ingredientId)!,
  supplier: suppliers.find((s) => s.id === ir.supplierId)!,
});

export const embedSupplyOrder = (so: FlatSupplyOrder): SupplyOrder => {
  const ir = ingredientRestaurants.find((i) => i.id === so.ingredientRestaurantId)!;
  return {
    ...so,
    ingredientRestaurant: embedIngredientRestaurant(ir),
    supplier: suppliers.find((s) => s.id === so.supplierId)!,
  };
};
