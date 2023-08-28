import { deliveryPersonServiceClient, deliveryServiceClient } from "@gateway/services/clients/delivery.client";
import { Delivery, DeliveryCreateInput, DeliveryPersonCreateInput, Status } from "@gateway/proto/delivery_pb";

export const createDelivery = (
  address: string,
  deliveryPersonId: string,
  userId: number,
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
  idUser: number,
  firstName: string,
  lastName: string,
  phone: string,
  locationList: number[],
) => {
  const deliveryPerson = new DeliveryPersonCreateInput()
    .setUserId(String(idUser))
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
