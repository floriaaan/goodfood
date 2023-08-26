import { Notification } from "@notifications/types/notification";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import prisma from "@notifications/lib/prisma";
import { MessageType } from "@prisma/client";

export const UpdateNotification = async (
	{ request }: Data<Notification>,
	callback: (err: any, response: Notification | null) => void
) => {
	try {
		const { id, title, message, message_type } = request;

		const notification = await prisma.notification.update({
			where: { id },
			data: {
				title,
				message,
				message_type: message_type as unknown as MessageType
			},
		}) as unknown as Notification;
		
		callback(null, notification);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};