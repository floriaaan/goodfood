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
];

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
];

export const deliveries: FlatDelivery[] = [
  { id: "delivery-1", eta: "2024-06-01T12:15:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.FULFILLED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-1" },
  { id: "delivery-2", eta: new Date(Date.now() + 25 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.PENDING, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-2" },
  { id: "delivery-3", eta: "2024-05-20T19:45:00.000Z", address: users.find((u) => u.id === "user-customer")!.mainaddress, status: Status.REJECTED, delivery_person_id: "user-delivery", user_id: "user-customer", restaurant_id: "rest-1" },
  { id: "delivery-4", eta: new Date(Date.now() - 60 * 60 * 1000).toISOString(), address: users.find((u) => u.id === "user-customer-2")!.mainaddress, status: Status.IN_PROGRESS, delivery_person_id: "user-delivery", user_id: "user-customer-2", restaurant_id: "rest-3" },
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

export const embedDelivery = (delivery: FlatDelivery): Delivery => ({
  ...delivery,
  deliveryPerson: embedDeliveryPerson(delivery.delivery_person_id),
});

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
