import { Status } from "@/types/global";
import { DeliveryType, Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { ExtendedProduct,Allergen, Category, Product, ProductType } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { Ingredient } from "@/types/stock";
import { User } from "@/types/user";

export const productList: Product[] = [
  {
    id: "product_id:1",
    name: "Pork qué prik thaï",
    price: 8.5,
    preparation: "15 min",
    weight: "420g",
    kilocalories: "182 kcal",
    allergens: [
      {
        id: "allergen_id:1",
        libelle: "Gluten",
      },
    ],
    nutriscore: "C",
    restaurant_id: "restaurant_id:1",
    type: ProductType.PLATS,
    image: "/images/tmp/pork.png",
    categories: [
      {
        id: "category_id:1",
        libelle: "Épicé",
        hexa_color: "#FBEAEF",
        icon: "🌶️",
      },
    ],
    comment: `Un sauté de porc épicé avec poivrons colorés, edamames et riz pour pimenter votre journée. Rassurez-vous, aucun porc épic n'a été blessé dans sa préparation !`,
  },
  {
    id: "product_id:2",
    name: "Goodwich au pesto verde",
    price: 7.5,
    preparation: "10 min",
    weight: "300g",
    kilocalories: "150 kcal",
    allergens: [
      {
        id: "allergen_id:1",
        libelle: "Gluten",
      },
    ],
    nutriscore: "B",
    restaurant_id: "restaurant_id:1",
    type: ProductType.PLATS,
    image: "/images/tmp/wich.png",
    categories: [
      {
        id: "category_id:2",
        libelle: "Frais",
        hexa_color: "#EAFBF5",
        icon: "🥗",
      },
    ],
    comment: `Le Goodwich au pesto verde combine le goût riche du pesto basilic avec la douceur de la mozzarella, le tout enveloppé dans un pain savoureux. Une expérience de saveurs simple et satisfaisante, idéale pour les amateurs de pesto`,
  },
  // TODO: how to handle extra products? (utensils, bread, etc.)
  {
    id: "extra/bread",
    name: "Pain",
    price: 0.15,
    preparation: "",
    weight: "",
    kilocalories: "",
    allergens: [
      {
        id: "allergen_id:1",
        libelle: "Gluten",
      },
    ],
    nutriscore: -1,
    restaurant_id: "",
    type: ProductType.SNACKS,
    image: "/images/tmp/bread.jpeg",
    categories: [],
    comment: `La preuve que les bonnes choses viennent en petites bouchées.`,
  },
  {
    id: "extra/utensils",
    name: "Couverts",
    price: 0.15,
    preparation: "N/A",
    weight: "N/A",
    kilocalories: "N/A",
    allergens: [],
    nutriscore: -1,
    restaurant_id: "",
    type: ProductType.SNACKS,
    image: "/images/tmp/utensils.jpeg",
    categories: [],
    comment: `Ces couverts en bois : l'option la plus branchée.`,
  },
];

export const extendedProductList: ExtendedProduct[] = [
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
    nutriscore: "C",
    restaurant_id: "restaurant-1",
    type: ProductType.PLATS,
    image: "/images/tmp/pork.png",
    categories: [
      {
        id: "category-1",
        libelle: "Épicé",
        hexa_color: "#FBEAEF",
        icon: "🌶️",
      },
    ],
    comment: `Un sauté de porc épicé avec poivrons colorés, edamames et riz pour pimenter votre journée. Rassurez-vous, aucun porc épic n'a été blessé dans sa préparation !`,
    stock_quantity: "25",
    additional_information: undefined,
    ingredients: [],
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
    nutriscore: "B",
    restaurant_id: "restaurant-1",
    type: ProductType.PLATS,
    image: "/images/tmp/wich.png",
    categories: [
      {
        id: "category-2",
        libelle: "Frais",
        hexa_color: "#EAFBF5",
        icon: "🥗",
      },
    ],
    comment: `Le Goodwich au pesto verde combine le goût riche du pesto basilic avec la douceur de la mozzarella, le tout enveloppé dans un pain savoureux. Une expérience de saveurs simple et satisfaisante, idéale pour les amateurs de pesto`,
    stock_quantity: "17",
    additional_information: undefined,
    ingredients: [],
  },
  // TODO: how to handle extra products? (utensils, bread, etc.)
  {
    id: "extra/bread",
    name: "Pain",
    price: 0.15,
    preparation: "",
    weight: "",
    kilocalories: "",
    allergens: [
      {
        id: "allergen-1",
        libelle: "Gluten",
      },
    ],
    nutriscore: -1,
    restaurant_id: "",
    type: ProductType.SNACKS,
    image: "/images/tmp/bread.jpeg",
    categories: [],
    comment: `La preuve que les bonnes choses viennent en petites bouchées.`,
    stock_quantity: "74",
    additional_information: undefined,
    ingredients: [],
  },
];

export const restaurantList: Restaurant[] = [
  {
    id: "restaurant_id:1",
    name: "Rouen Gros Horloge",
    address: "1 Rue du Gros Horloge, 76000 Rouen",
    locationList: [49.440459, 1.094853],
    openinghoursList: ["11h30 - 14h30 / 18h30 - 22h30"],
    phone: "02 35 71 00 00",
    useridsList: [],
    createdat: "Tue Aug 29 2023 07:28:41 GMT+0000 (Coordinated Universal Time)",
    updatedat: "Tue Aug 29 2023 07:28:41 GMT+0000 (Coordinated Universal Time)",
  },
  {
    id: "restaurant_id:2",
    name: "Rouen Pierre Corneille",
    address: "76 Rue Pierre Corneille, 76000 Rouen",
    locationList: [49.442459, 1.094853],
    openinghoursList: ["11h30 - 14h30 / 18h30 - 22h30"],
    phone: "02 35 71 00 00",
    useridsList: [],
    createdat: "Tue Aug 29 2023 07:28:41 GMT+0000 (Coordinated Universal Time)",
    updatedat: "Tue Aug 29 2023 07:28:41 GMT+0000 (Coordinated Universal Time)",
  },
];

export const orderList: Order[] = [
  {
    id: "order_id:1",
    payment_id: "payment_id:1",
    payment: {
      id: "payment_id:1",
      total: 8.5,
      status: PaymentStatus.APPROVED,
      created_at: "2023-08-07T10:20:00.000Z",
      updated_at: "2023-08-07T10:20:00.000Z",
      user_id: "user_id:1",
      user: {
        id: "user_id:1",
        name: "John Doe",
        email: "john@doe.com",
      },
    },

    delivery_id: "delivery_id:1",
    delivery: {
      id: "delivery_id:1",
      eta: "2023-08-07T10:20:00.000Z",
      address: "9 rue des Champs, 27310 Saint-Ouen-de-Thouberville",
      status: Status.PENDING,
      restaurant_id: "restaurant_id:1",
      person: {
        id: "delivery_person_id:1",
        first_name: "John",
        last_name: "Doe",
        phone: "0612345678",
        location: [49.440459, 1.094853],
      },
      delivery_person_id: "delivery_person_id:1",
      user_id: "user_id:1",
    },

    delivery_type: DeliveryType.DELIVERY,
    user: {
      id: "user_id:1",
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone: "0612345678",
    },
    basket_snapshot: {
      json: {
        "product_id:1": { count: 1, price: 15 },
        "product_id:2": { count: 2, price: 10 },
      },
      string: JSON.stringify({
        "product_id:1": { count: 1, price: 15 },
        "product_id:2": { count: 2, price: 10 },
      }),
      total: 35,
    },
    status: Status.PENDING,
    restaurant_id: "restaurant_id:1",
    created_at: new Date("2000-01-01T12:00:00.000Z"),
    updated_at: new Date("2000-01-01T12:00:00.000Z"),
  },
  {
    id: "order_id:2",
    payment_id: "payment_id:2",
    payment: {
      id: "payment_id:2",
      total: 8.5,
      status: PaymentStatus.PENDING,
      created_at: "2023-08-07T10:20:00.000Z",
      updated_at: "2023-08-07T10:20:00.000Z",
      user_id: "user_id:1",
      user: {
        id: "user_id:1",
        name: "John Doe",
        email: "john@doe.com",
      },
    },
    delivery_id: "delivery_id:2",
    delivery: {
      id: "delivery_id:2",
      eta: "2021-05-20T12:00:00.000Z",
      address: "1 Rue du Gros Horloge, 76000 Rouen",
      status: Status.PENDING,
      restaurant_id: "restaurant_id:1",
      person: {
        id: "delivery_person_id:2",
        first_name: "Jane",
        last_name: "Doe",
        phone: "0612345678",
        location: [49.370459, 0.9],
      },
      delivery_person_id: "delivery_person_id:1",
      user_id: "user_id:1",
    },
    delivery_type: DeliveryType.DELIVERY,
    user: {
      id: "user_id:1",
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone: "0612345678",
    },
    basket_snapshot: {
      json: {
        "product_id:1": { count: 1, price: 15 },
        "product_id:2": { count: 4, price: 5 },
      },
      string: JSON.stringify({
        "product_id:1": { count: 1, price: 15 },
        "product_id:2": { count: 4, price: 5 },
      }),
      total: 35,
    },
    status: Status.FULFILLED,
    restaurant_id: "restaurant_id:2",
    created_at: new Date("2023-11-17T12:00:00.000Z"),
    updated_at: new Date("2023-11-17T12:00:00.000Z"),
  },
];

export const user: User = {
  id: "user_id:1",
  firstName: "John",
  lastName: "Doe",
  email: "user@mail.com",
  phone: "0642424242",
  mainaddressid: 0,
  mainaddress: {
    id: 5,
    street: "7 rue de la paix",
    zipcode: "76600",
    country: "France",
    city: "Le Havre",
    lat: 49.443233489990234,
    lng: 1.099971055984497,
  },
  roleid: 0,
  role: {
    id: 0,
    code: "ADMIN",
    label: "Administrateur",
  },
};

export const ingredientList: Ingredient[] = [
  {
    id: 1,
    name: "Poulet",
    description: "Poulet de qualité supérieure",
  },
  {
    id: 2,
    name: "Salade",
    description: "Salade laitue Iceberg",
  },
  {
    id: 3,
    name: "Tomate",
    description: "Tomate coupée en dés",
  },
  {
    id: 4,
    name: "Oignon",
    description: "Oignon rouge",
  },
];

export const allergensList: Allergen[] = [
  { id: "allergen_id:1", libelle: "Gluten" },
  { id: "allergen_id:2", libelle: "Lactose" },
  { id: "allergen_id:3", libelle: "Oeuf" },
  { id: "allergen_id:4", libelle: "Arachide" },
];

export const categoriesList: Category[] = [
  {
    id: "category_id:1",
    libelle: "Épicé",
    hexa_color: "#FBEAEF",
    icon: "🌶️",
  },
  {
    id: "category_id:2",
    libelle: "Frais",
    hexa_color: "#EAFBF5",
    icon: "🥗",
  },
  {
    id: "category_id:3",
    libelle: "Sucré",
    hexa_color: "#FBEAEF",
    icon: "🍩",
  },
  {
    id: "category_id:4",
    libelle: "Salé",
    hexa_color: "#EAFBF5",
    icon: "🍟",
  },
];

export const stats = [
  {
    name: "Revenus de la journée",
    value: "9456",
    changeValue: "25",
    date: new Date(),
  },
  {
    name: "Revenus de la semaine",
    value: "15236",
    changeValue: "-6",
    date: new Date(),
  },
  {
    name: "Revenus du mois",
    value: "65684",
    changeValue: "15",
    date: new Date(),
  },
  {
    name: "Dépences de la journée",
    value: "4686",
    changeValue: "25",
    date: new Date(),
  },
  {
    name: "Dépences de la semaine",
    value: "15656",
    changeValue: "-6",
    date: new Date(),
  },
  {
    name: "Dépences du mois",
    value: "64658",
    changeValue: "15",
    date: new Date(),
  },
];
