import { deliveryPersonServiceClient, deliveryServiceClient } from "@gateway/services/clients/delivery.client";
import {
  Address,
  Delivery,
  DeliveryCreateInput,
  DeliveryId,
  DeliveryPersonCreateInput,
  DeliveryPersonList,
  Location,
} from "@gateway/proto/delivery_pb";

export const createDelivery = (
  address: Address,
  userId: string,
  restaurantId: string,
): Promise<Delivery | undefined> => {
  const deliveryCreateInput = new DeliveryCreateInput()
    .setAddress(address ? new Address().setLat(address.getLat()).setLng(address.getLng()) : address)
    .setUserId(userId.toString())
    .setRestaurantId(restaurantId);
  return new Promise((resolve, reject) => {
    deliveryServiceClient.createDelivery(deliveryCreateInput, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

// TODO: add google call
const getEtaByUserAddress = (address: string) => {
  return new Date().toString();
};

export const createDeliveryPerson = (
  idUser: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: Address.AsObject | undefined,
) => {
  const deliveryPerson = new DeliveryPersonCreateInput()
    .setUserId(idUser)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setAddress(address ? new Address().setLat(address.lat).setLng(address.lng) : address);
  return new Promise((resolve, reject) => {
    deliveryPersonServiceClient.createDeliveryPerson(deliveryPerson, (error, response) => {
      if (error) {
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
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
