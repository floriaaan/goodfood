import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import {
  Notification,
  NotificationIdRequest,
} from "@notifications/types/notification";

export const ReadNotification = async (
  { request }: Data<NotificationIdRequest>,
  callback: (err: any, response: Notification | null) => void
) => {
  try {
    const { id } = request;

    const notification = await prisma.notification.update({
      where: { id },
      data: { read_at: new Date() },
    });

    callback(null, notification);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
