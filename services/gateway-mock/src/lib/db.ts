import { faker } from "@faker-js/faker";
import {
  Allergen,
  Basket,
  Category,
  Delivery,
  DeliveryPerson,
  DeliveryType,
  Ingredient,
  IngredientRestaurant,
  MainAddress,
  Notification,
  Order,
  Payment,
  PaymentStatus,
  Product,
  ProductType,
  Promotion,
  Restaurant,
  Role,
  Status,
  Supplier,
  SupplyOrder,
  User,
} from "@mock/types";

// Deterministic across restarts so ids/relations stay stable while developing the frontend.
faker.seed(4242);

const role = (code: Role["code"], id: number): Role => ({ id, code, label: code });

const address = (): MainAddress => ({
  id: faker.string.uuid(),
  street: faker.location.streetAddress(),
  zipcode: faker.location.zipCode(),
  country: "France",
  city: faker.location.city(),
  lat: Number(faker.location.latitude()),
  lng: Number(faker.location.longitude()),
});

const buildTestUsers = (): User[] => [
  {
    id: "user-admin-0001",
    firstName: "Ada",
    lastName: "Admin",
    email: "admin@goodfood.com",
    password: "password",
    phone: "0600000001",
    mainaddressid: "addr-admin-0001",
    mainaddress: { ...address(), id: "addr-admin-0001" },
    roleid: 1,
    role: role("ADMIN", 1),
  },
  {
    id: "user-manager-0001",
    firstName: "Marc",
    lastName: "Manager",
    email: "manager@goodfood.com",
    password: "password",
    phone: "0600000002",
    mainaddressid: "addr-manager-0001",
    mainaddress: { ...address(), id: "addr-manager-0001" },
    roleid: 2,
    role: role("MANAGER", 2),
  },
  {
    id: "user-customer-0001",
    firstName: "Cléa",
    lastName: "Client",
    email: "user@goodfood.com",
    password: "password",
    phone: "0600000003",
    mainaddressid: "addr-customer-0001",
    mainaddress: { ...address(), id: "addr-customer-0001" },
    roleid: 3,
    role: role("USER", 3),
  },
  {
    id: "user-delivery-0001",
    firstName: "Dan",
    lastName: "Livreur",
    email: "delivery@goodfood.com",
    password: "password",
    phone: "0600000004",
    mainaddressid: "addr-delivery-0001",
    mainaddress: { ...address(), id: "addr-delivery-0001" },
    roleid: 4,
    role: role("DELIVERY_PERSON", 4),
  },
];

const buildRandomUsers = (count: number): User[] =>
  Array.from({ length: count }, () => {
    const id = faker.string.uuid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      id,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: "password",
      phone: faker.phone.number(),
      mainaddressid: `addr-${id}`,
      mainaddress: { ...address(), id: `addr-${id}` },
      roleid: 3,
      role: role("USER", 3),
    };
  });

const users: User[] = [...buildTestUsers(), ...buildRandomUsers(10)];

const categories: Category[] = ["Entrée", "Plat", "Dessert", "Boisson", "Snack", "Extra"].map((libelle) => ({
  id: faker.string.uuid(),
  libelle,
  hexaColor: faker.color.rgb(),
  icon: faker.helpers.arrayElement(["utensils", "pizza-slice", "ice-cream", "glass-water", "cookie", "plus"]),
}));

const allergens: Allergen[] = [
  "Gluten",
  "Crustacés",
  "Œufs",
  "Poisson",
  "Arachides",
  "Soja",
  "Lait",
  "Fruits à coque",
].map((libelle) => ({ id: faker.string.uuid(), libelle }));

const restaurants: Restaurant[] = Array.from({ length: 6 }, () => {
  const id = faker.string.uuid();
  const managers = faker.helpers.arrayElements(
    users.filter((u) => u.role.code === "MANAGER" || u.role.code === "ADMIN"),
    { min: 1, max: 2 },
  );
  return {
    id,
    name: `GoodFood ${faker.location.city()}`,
    address: {
      lat: Number(faker.location.latitude()),
      lng: Number(faker.location.longitude()),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      country: "France",
    },
    openinghoursList: ["Lun-Ven 11h-22h", "Sam-Dim 12h-23h"],
    description: faker.lorem.sentence(),
    phone: faker.phone.number(),
    useridsList: managers.map((m) => m.id),
    createdat: faker.date.past().toISOString(),
    updatedat: faker.date.recent().toISOString(),
  };
});

const products: Product[] = restaurants.flatMap((restaurant) =>
  Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    image: faker.image.urlLoremFlickr({ category: "food" }),
    comment: faker.lorem.sentence(),
    price: Number(faker.commerce.price({ min: 3, max: 25 })),
    preparation: `${faker.number.int({ min: 5, max: 30 })} min`,
    weight: `${faker.number.int({ min: 100, max: 600 })}g`,
    kilocalories: `${faker.number.int({ min: 150, max: 900 })}`,
    nutriscore: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]),
    type: faker.helpers.enumValue(ProductType),
    restaurantId: restaurant.id,
    isOutOfStock: faker.datatype.boolean({ probability: 0.1 }),
    categoriesList: faker.helpers.arrayElements(categories, { min: 1, max: 2 }),
    allergensList: faker.helpers.arrayElements(allergens, { min: 0, max: 3 }),
    recipeList: [],
  })),
);

const promotions: Promotion[] = restaurants.map((restaurant) => ({
  id: faker.string.uuid(),
  code: faker.string.alpha({ length: 6, casing: "upper" }),
  reduction: faker.number.int({ min: 5, max: 30 }),
  method: "PERCENTAGE",
  restaurantId: restaurant.id,
}));

const suppliers: Supplier[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: faker.company.name(),
  contact: faker.phone.number(),
}));

const ingredients: Ingredient[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: faker.commerce.productMaterial(),
  description: faker.lorem.words(4),
}));

const ingredientRestaurants: IngredientRestaurant[] = restaurants.flatMap((restaurant, ri) =>
  ingredients.slice(0, 6).map((ingredient, ii) => ({
    id: ri * 6 + ii + 1,
    key: `${restaurant.id}-${ingredient.id}`,
    alertThreshold: 10,
    quantity: faker.number.int({ min: 0, max: 100 }),
    inProductListList: [],
    unitPrice: Number(faker.commerce.price({ min: 1, max: 10 })),
    pricePerKilo: Number(faker.commerce.price({ min: 1, max: 15 })),
    restaurantId: restaurant.id,
    ingredientId: ingredient.id,
    supplierId: suppliers[ii % suppliers.length].id,
    updatedAt: faker.date.recent().toISOString(),
  })),
);

const supplyOrders: SupplyOrder[] = ingredientRestaurants.slice(0, 8).map((ir, i) => ({
  id: i + 1,
  quantity: faker.number.int({ min: 10, max: 100 }),
  unitPrice: ir.unitPrice,
  ingredientRestaurantId: ir.id,
  supplierId: ir.supplierId,
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const deliveryPersons: DeliveryPerson[] = users
  .filter((u) => u.role.code === "DELIVERY_PERSON")
  .map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    address: u.mainaddress,
  }));

const testUser = users.find((u) => u.email === "user@goodfood.com")!;

const payments: Payment[] = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  stripe_id: `pi_${faker.string.alphanumeric(24)}`,
  total: Number(faker.commerce.price({ min: 10, max: 80 })),
  status: faker.helpers.enumValue(PaymentStatus),
  user_id: testUser.id,
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
}));

const deliveries: Delivery[] = payments.map((payment, i) => ({
  id: faker.string.uuid(),
  eta: faker.date.soon().toISOString(),
  address: testUser.mainaddress,
  status: faker.helpers.enumValue(Status),
  delivery_person_id: deliveryPersons[0]?.id ?? "",
  user_id: payment.user_id,
  restaurant_id: restaurants[i % restaurants.length].id,
}));

const orders: Order[] = payments.map((payment, i) => {
  const restaurant = restaurants[i % restaurants.length];
  const restaurantProducts = products.filter((p) => p.restaurantId === restaurant.id).slice(0, 3);
  return {
    id: faker.string.uuid(),
    deliveryType: faker.helpers.enumValue(DeliveryType),
    restaurantId: restaurant.id,
    userId: testUser.id,
    basketSnapshot: {
      string: "",
      json: {
        restaurantId: restaurant.id,
        productsList: restaurantProducts.map((p) => ({ id: p.id, name: p.name, price: p.price, quantity: 1 })),
      },
      total: payment.total,
    },
    status: faker.helpers.enumValue(Status),
    paymentId: payment.id,
    deliveryId: deliveries[i].id,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
  };
});

const notifications: Notification[] = users
  .filter((u) => u.role.code === "USER")
  .flatMap((u) =>
    Array.from({ length: 2 }, () => ({
      id: faker.string.uuid(),
      userId: u.id,
      title: faker.lorem.words(3),
      content: faker.lorem.sentence(),
      read: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
    })),
  );

const baskets = new Map<string, Basket>();

export const db = {
  users,
  categories,
  allergens,
  restaurants,
  products,
  promotions,
  suppliers,
  ingredients,
  ingredientRestaurants,
  supplyOrders,
  deliveryPersons,
  payments,
  deliveries,
  orders,
  notifications,
  baskets,
};
