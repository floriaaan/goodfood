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

export type Address = {
  lat: number;
  lng: number;

  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;
};
