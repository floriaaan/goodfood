import { log } from "@delivery/lib/log";
import { prisma } from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { Delivery } from "@delivery/types/delivery";

export const UpdateDelivery = async (
  { request }: Data<Delivery>,
  callback: (err: any, response: any) => void
) => {
  try {
    const {
      eta,
      address,
      status,
      delivery_person_id,
      id,
    } = request;

    const old = await prisma.delivery.findUnique({
      where: { id },
      include: {
        delivery_person: {
          include: { address: true },
        },
        address: true,
        restaurant_address: true,
      },
    });
    if (!old) {
      throw new Error("Delivery not found");
    }

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        eta: eta ? new Date(eta): old.eta, // todo: calculate new eta but avoid changing the original eta the most possible
        address: address ? {
          update: {
            street: address.street,
            city: address.city,
            zipcode: address.zipcode,
            country: address.country,
            lat: address.lat,
            lng: address.lng,
          },
        }: undefined,
        status: status || old.status,
        delivery_person_id: delivery_person_id || old.delivery_person_id,
      },
      include: {
        delivery_person: {
          include: { address: true },
        },
        address: true,
        restaurant_address: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
