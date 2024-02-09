import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import { NotificationIdRequest } from "@notifications/types/notification";

export const DeleteNotification = async (
  { request }: Data<NotificationIdRequest>,
  callback: (err: any, response: null) => void
) => {
  try {
    const { id } = request;

    await prisma.notification.delete({ where: { id } });

    callback(null, null);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
