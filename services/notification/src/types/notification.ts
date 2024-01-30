import { Notification } from "@prisma/client";

export type CreateNotificationRequest = Omit<
  Notification,
  "id" | "created_at" | "updated_at" | "read_at"
>;

export type NotificationIdRequest = {
  id: Notification["id"];
};

export type GetNotificationsByUserIdRequest = {
  user_id: Notification["user_id"];
};

export type GetNotificationsByRestaurantIdRequest = {
  restaurant_id: Notification["restaurant_id"];
};

export type UpdateNotificationRequest = Partial<
  Omit<
    Notification,
    | "id"
    | "created_at"
    | "updated_at"
    | "read_at"
    | "user_id"
    | "restaurant_id"
    | "type"
  >
> & {
  id: Notification["id"];
};

export type NotificationList = {
  notifications: Notification[];
};

export { Notification };
