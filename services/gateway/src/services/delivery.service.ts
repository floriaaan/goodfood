import { deliveryPersonServiceClient, deliveryServiceClient } from "@gateway/services/clients/delivery.client";
import {
  Delivery,
  DeliveryCreateInput,
  DeliveryId,
  DeliveryPerson,
  DeliveryPersonCreateInput,
  DeliveryPersonList,
  Location,
  Status,
} from "@gateway/proto/delivery_pb";
import { User, UserId } from "@gateway/proto/user_pb";
import { userServiceClient } from "@gateway/services/clients/user.client";

export const createDelivery = (
  address: string,
  deliveryPersonId: string,
  userId: string,
  restaurantId: string,
): Promise<Delivery | undefined> => {
  const deliveryCreateInput = new DeliveryCreateInput()
    .setEta(getEtaByUserAddress(address))
    .setAddress(address)
    .setStatus(Status.PENDING)
    .setDeliveryPersonId(deliveryPersonId)
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
  locationList: number[],
) => {
  const deliveryPerson = new DeliveryPersonCreateInput()
    .setUserId(idUser)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setLocationList(locationList);
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
