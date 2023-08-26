import { NotificationId, Notification } from "@notifications/types/notification";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import prisma from "@notifications/lib/prisma";

export const GetNotification = async (
	{ request }: Data<NotificationId>,
	callback: (err: any, response: Notification | null) => void
) => {
	try {
		const { id } = request;

		const notification = await prisma.notification.findFirstOrThrow({ where: { id } }) as unknown as Notification;

		callback(null, notification);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};