export type Data<T> = {
  request: T;
};

export type Address = {
  id: string;

  lat: number;
  lng: number;

  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;
};
