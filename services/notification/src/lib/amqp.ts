import amqp from "amqplib"; 
import plunk from "@notifications/lib/plunk";
import { msg } from "@notifications/middleware/log";
import { log } from "@notifications/lib/log";
import { Data } from "@notifications/types";
import { NotificationCreateInput, MessageType } from "@notifications/types/notification";
import { CreateNotification } from "@notifications/handler/create";

const DEFAULT_QUEUE = "log";
const DEFAULT_SUB_QUEUE = "notification";


async function createQueue(queue = DEFAULT_QUEUE) {
	try {
		const connection = await amqp.connect(process.env.AMQP_URL || "");
		const channel = await connection.createChannel();
		await channel.assertQueue(queue, { durable: false });
		return channel;
	} catch (error) {
		return error as Error;
	}
}

async function connectQueue(queue = DEFAULT_QUEUE) {
	try {
		const connection = await amqp.connect(process.env.AMQP_URL || "");
		const channel = await connection.createChannel();
		await channel.assertExchange(queue, "fanout", { durable: true });
		return channel;
	} catch (error) {
		return error as Error;
	}
}

const toLog = (message: any) => {
	const { request, path } = message;
	return { event_message: path, metadata: { request } };
};

export const publish = async (message: any, queue = DEFAULT_QUEUE) => {
	const channel = await connectQueue(queue);
	if (channel instanceof Error)
		return console.log("Error to connect to queue: ", channel);
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(toLog(message))));
	log.debug(
		msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
		JSON.stringify(message)
	);
};

const toNotification = (message: any) => {
	const { email, title, messageText: messageText } = JSON.parse(message.content.toString());
	return { email: email, title: title, messageText: messageText, messageType: MessageType.OUTPUT };
}

export const subscribe = async (queue = DEFAULT_SUB_QUEUE) => {
	const channel = await createQueue(queue);
	if (channel instanceof Error)
		return console.log("Error to create queue: ", channel);

	await channel.consume(
		queue,
		async function (message) {
			const {email, title, messageText, messageType} = toNotification(message);
			const notification = {
				request:
					{
						title: title,
						message: messageText,
						message_type: messageType as unknown as MessageType
					}
			} as Data<NotificationCreateInput>

			await CreateNotification(notification, () => {
			});

			const {success} = await plunk.emails.send({
				to: email,
				body: messageText,
				subject: title
			});

			if (success)
				log.debug(
					msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
					"Email send"
				);
			else
				log.debug(
					msg("AMQP", `${queue} (queue)`, new Date(), new Date()),
					"Email not send"
				);
		},
		{
			noAck: true
		}
	)
}
