export type Restaurant = {
  id: string;

  name: string;
  description?: string;

  address: Address;

  openingHours: string[];
  phone?: string;

  userIds: string[];

  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Address = {
  id: string;

  lat: number;
  lng: number;

  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;

  restaurantId: string;
};

export type RestaurantCreateInput = Omit<
  Restaurant,
  "id" | "createdAt" | "updatedAt"
>;

export type RestaurantId = {
  id: Restaurant["id"];
};

export type ByLocationInput = {
  lat: number;
  lng: number;
};

export type RestaurantList = {
  restaurants: Restaurant[];
};
