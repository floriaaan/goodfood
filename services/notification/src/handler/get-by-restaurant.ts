import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import {
  GetNotificationsByRestaurantIdRequest,
  NotificationList,
} from "@notifications/types/notification";

export const GetNotificationsByRestaurantId = async (
  { request }: Data<GetNotificationsByRestaurantIdRequest>,
  callback: (err: any, response: NotificationList | null) => void
) => {
  try {
    const { restaurant_id } = request;

    const notifications = await prisma.notification.findMany({
      where: { restaurant_id },
    });

    callback(null, { notifications });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
