import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import {
	Notification,
	UpdateNotificationRequest,
} from "@notifications/types/notification";

export const UpdateNotification = async (
  { request }: Data<UpdateNotificationRequest>,
  callback: (err: any, response: Notification | null) => void
) => {
  try {
    const { id, title, description, icon, image, callback_url } = request;

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        image,
        callback_url,
      },
    });

    callback(null, notification);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
