export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  mainaddressid?: number;
  mainaddress?: MainAddress;

  roleid: number;
  role: Role;
};

export type MainAddress = {
  id: number;
  street: string;
  zipcode: string;
  country: string;
  // TODO: add city to microservice
  city: string;

  lat: number;
  lng: number;
};

export type Role = {
  id: number;
  code: string;
  label: string;
};
