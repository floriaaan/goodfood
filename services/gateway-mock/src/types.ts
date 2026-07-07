export type Role = { id: number; code: "ADMIN" | "MANAGER" | "USER" | "DELIVERY_PERSON"; label: string };

export type MainAddress = {
  id: string;
  street: string;
  zipcode: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  mainaddressid: string;
  mainaddress: MainAddress;
  roleid: number;
  role: Role;
};

export type Address = {
  lat: number;
  lng: number;
  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  address: Address;
  openinghoursList: string[];
  description?: string;
  phone: string;
  useridsList: string[];
  createdat: string;
  updatedat: string;
};

export enum ProductType {
  ENTREES = 0,
  PLATS = 1,
  DESSERTS = 2,
  BOISSONS = 3,
  SNACKS = 4,
  EXTRA = 5,
}

export type Allergen = { id: string; libelle: string };
export type Category = { id: string; libelle: string; hexaColor: string; icon: string };
export type Recipe = { ingredientId: string; quantity: number };

export type Product = {
  id: string;
  name: string;
  image: string;
  comment: string;
  price: number;
  preparation: string;
  weight: string;
  kilocalories: string;
  nutriscore: number | string;
  type: ProductType;
  restaurantId: string;
  isOutOfStock?: boolean;
  categoriesList: Category[];
  allergensList: Allergen[];
  recipeList: Recipe[];
};

export type BasketItem = { id: string; quantity: number };
export type Basket = { userId: string; productsList: BasketItem[]; restaurantId: string };

export enum Status {
  PENDING = 0,
  IN_PROGRESS = 1,
  FULFILLED = 2,
  REJECTED = 3,
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type Payment = {
  id: string;
  stripe_id: string;
  total: number;
  status: PaymentStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type DeliveryPerson = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
};

export type Delivery = {
  id: string;
  eta: string;
  address: Address;
  status: Status;
  delivery_person_id: string;
  user_id: string;
  restaurant_id: string;
};

export enum DeliveryType {
  DELIVERY = 0,
  TAKEAWAY = 1,
}

export type Order = {
  id: string;
  deliveryType: DeliveryType;
  restaurantId: string;
  userId: string;
  basketSnapshot: { string: string; json: unknown; total: number };
  status: Status;
  paymentId: string;
  deliveryId: string;
  created_at: string;
  updated_at: string;
};

export type Promotion = {
  id: string;
  code: string;
  reduction: number;
  method: string;
  restaurantId: string;
};

export type Ingredient = { id: number; name: string; description: string | null };

export type Supplier = { id: number; name: string; contact: string };

export type IngredientRestaurant = {
  id: number;
  key: string;
  alertThreshold: number;
  quantity: number;
  inProductListList: string[];
  unitPrice: number;
  pricePerKilo: number;
  restaurantId: string;
  ingredientId: number;
  supplierId: number;
  updatedAt: string;
};

export type SupplyOrder = {
  id: number;
  quantity: number;
  unitPrice: number;
  ingredientRestaurantId: number;
  supplierId: number;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
};
