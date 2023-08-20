import { MessageType, MessageTypeInput, NotificationList } from "@notifications/types/notification";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import prisma from "@notifications/lib/prisma";

export const GetNotifications = async (
	{ request }: Data<MessageTypeInput>,
	callback: (err: any, response: NotificationList | null) => void
) => {
	try {
		const { message_type } = request;
		
		log.debug(message_type);

		const notifications = { 
			notifications: await prisma.notification.findMany({ where: { message_type: message_type as MessageType } }) 
		} as unknown as NotificationList;

		callback(null, notifications);
	} catch (error) {
		log.error(error);
		callback(error, null);
	}
};