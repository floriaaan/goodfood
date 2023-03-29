import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Status } from "@prisma/client";

type DeliveryCreateInput = {
  eta: string;
  address: string;
  status: Status;
  delivery_person_id: string;
};

export const CreateDelivery = async (
  data: any,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at CreateDelivery handler\n", data.request);
  try {
    const { request } = data;
    const { eta, address, status, delivery_person_id } =
      request as DeliveryCreateInput;

    const delivery = await prisma.delivery.create({
      data: {
        eta: new Date(eta),
        address,
        status,
        person: {
          connect: {
            id: delivery_person_id,
          },
        },
      },
      include: {
        person: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
