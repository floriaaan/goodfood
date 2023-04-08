import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";

export const ListDeliveryPersons = async (
  { request }: Data<{}>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at ListDeliveryPersons handler\n", request);
  try {
    const delivery_persons = await prisma.deliveryPerson.findMany();
    callback(null, { delivery_persons });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
