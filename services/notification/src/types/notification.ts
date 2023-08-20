export interface Notification {
    id: string;

    title: string;
    message: string;
    message_type: MessageType;
}

export interface NotificationCreateInput {
    title: string;
    message: string;
    message_type: MessageType;
}

export interface NotificationId {
    id: string;
}

export interface NotificationList {
	notifications: Notification[];
}

export interface MessageTypeInput {
    message_type: string;
}

export const enum MessageType {
	USER_REQUEST = "USER_REQUEST",
	OUTPUT = "OUTPUT"
}
