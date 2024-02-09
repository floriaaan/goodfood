import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import {
  CreateNotificationRequest,
  Notification,
} from "@notifications/types/notification";

export const CreateNotification = async (
  { request }: Data<CreateNotificationRequest>,
  callback: (err: any, response: Notification | null) => void
) => {
  try {
    const {
      title,
      description,
      icon,
      image,
      callback_url,
      type,
      user_id,
      restaurant_id,
    } = request;

    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        icon,
        image,
        callback_url,
        type,
        user_id,
        restaurant_id,
      },
    });

    callback(null, notification);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
