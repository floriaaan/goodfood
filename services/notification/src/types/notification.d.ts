export type Notification = {
    id: string;

    title: string;
    message: string;
    message_type: MessageType;
}

export type NotificationCreateInput = {
    title: string;
    message: string;
    message_type: MessageType;
}

export type NotificationId = {
    id: string;
}

export type NotificationList = {
	notifications: Notification[];
}

export type MessageTypeInput = {
    message_type: string;
}

export const enum MessageType {
	USER_REQUEST = "USER_REQUEST",
	OUTPUT = "OUTPUT"
}
