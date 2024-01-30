import { log } from "@notifications/lib/log";
import prisma from "@notifications/lib/prisma";
import { Data } from "@notifications/types";
import {
    GetNotificationsByUserIdRequest,
    NotificationList,
} from "@notifications/types/notification";

export const GetNotificationsByUserId = async (
  { request }: Data<GetNotificationsByUserIdRequest>,
  callback: (err: any, response: NotificationList | null) => void
) => {
  try {
    const { user_id } = request;

    const notifications = await prisma.notification.findMany({
      where: { user_id },
    });

    callback(null, { notifications });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
