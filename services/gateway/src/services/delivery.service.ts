import {
  Address,
  Delivery,
  DeliveryCreateInput,
  DeliveryId,
  DeliveryPersonCreateInput,
  DeliveryPersonList,
  Location,
} from "@gateway/proto/delivery_pb";
import { deliveryPersonServiceClient, deliveryServiceClient } from "@gateway/services/clients/delivery.client";

export const createDelivery = (
  address: Address,
  userId: string,
  restaurantId: string,
  restaurantAddress: Address,
): Promise<Delivery | undefined> => {
  const deliveryCreateInput = new DeliveryCreateInput()
    .setAddress(address)
    .setUserId(userId.toString())
    .setRestaurantId(restaurantId)
    .setRestaurantAddress(restaurantAddress);
  return new Promise((resolve, reject) => {
    deliveryServiceClient.createDelivery(deliveryCreateInput, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const createDeliveryPerson = (
  idUser: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: Address.AsObject | undefined,
) => {
  const dp_address = address ? new Address().setLat(address.lat).setLng(address.lng) : undefined;
  if (address?.street) dp_address?.setStreet(address.street);
  if (address?.city) dp_address?.setCity(address.city);
  if (address?.zipcode) dp_address?.setZipcode(address.zipcode);
  if (address?.country) dp_address?.setCountry(address.country);

  const deliveryPerson = new DeliveryPersonCreateInput()
    .setUserId(idUser)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setAddress(dp_address);
  return new Promise((resolve, reject) => {
    deliveryPersonServiceClient.createDeliveryPerson(deliveryPerson, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const getDelivery = (id: string): Promise<Delivery | undefined> => {
  const deliveryId = new DeliveryId();
  deliveryId.setId(id);
  return new Promise((resolve, reject) => {
    deliveryServiceClient.getDelivery(deliveryId, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const getNearestDeliveryPerson = (lat: string, lng: string): Promise<DeliveryPersonList | undefined> => {
  const location = new Location().setLatitude(Number(lat)).setLongitude(Number(lng));
  return new Promise((resolve, reject) => {
    deliveryPersonServiceClient.listNearDeliveryPersons(location, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
