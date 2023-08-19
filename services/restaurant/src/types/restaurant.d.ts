export type Restaurant = {
  id: string;

  name: string;
  description?: string;

  location: [number, number];
  address?: string;

  openingHours: string[];
  phone?: string;

  createdAt: Date | string;
  updatedAt: Date | string;
};

export type RestaurantCreateInput = Omit<
  Restaurant,
  "id" | "createdAt" | "updatedAt"
>;

export type RestaurantId = {
  id: Restaurant["id"];
};

export type ByLocationInput = {
  location: Restaurant["location"];
};

export type RestaurantList = {
  restaurants: Restaurant[];
};
