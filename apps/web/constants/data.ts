import { Status } from "@/types/global";
import { DeliveryType, Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { Product, ProductType } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { User } from "@/types/user";

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
    image: "/images/tmp/pork.png",
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
    image: "/images/tmp/wich.png",
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
  // TODO: how to handle extra products? (utensils, bread, etc.)
  // {
  //   id: "extra/bread",
  //   name: "Pain",
  //   price: 0.15,
  //   preparation: "",
  //   weight: "",
  //   kilocalories: "",
  //   allergens: [
  //     {
  //       id: "allergen-1",
  //       libelle: "Gluten",
  //     },
  //   ],
  //   nutriscore: -1,
  //   restaurant_id: "",
  //   type: ProductType.EXTRA,
  //   image: "",
  //   categories: [],
  //   comment: ``,
  // },
];

export const restaurantList: Restaurant[] = [
  {
    id: "restaurant-1",
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
    id: "restaurant-2",
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
    created_at: new Date("2000-01-01T12:00:00.000Z"),
    updated_at: new Date("2000-01-01T12:00:00.000Z"),
  },
];

export const user: User = {
  id: 5,
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
    id: 2,
    code: "USER",
    label: "User",
  },
};
