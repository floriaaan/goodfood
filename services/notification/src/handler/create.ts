import { NotificationCreateInput, Notification } from "@notifications/types/notification";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import prisma from "@notifications/lib/prisma";
import { MessageType } from "@prisma/client";

export const CreateNotification = async (
	{ request }: Data<NotificationCreateInput>,
	callback: (err: any, response: Notification | null) => void
) => {
	try {
		const {  message, message_type, title } = request;

		const notifications = await prisma.notification.create({
			data: {
				title,
				message,
				message_type: message_type as unknown as MessageType
			},
		}) as unknown as Notification;

		callback(null, notifications);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};