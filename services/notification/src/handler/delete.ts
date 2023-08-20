import { NotificationId } from "@notifications/types/notification";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import prisma from "@notifications/lib/prisma";

export const DeleteNotification = async (
	{ request }: Data<NotificationId>,
	callback: (err: any, response: null) => void
) => {
	try {
		const { id } = request;

		await prisma.notification.delete({ where : { id } });
		
		callback(null, null);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};