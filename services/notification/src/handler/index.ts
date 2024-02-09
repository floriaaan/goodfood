import { CreateNotification } from "@notifications/handler/create";
import { GetNotification } from "@notifications/handler/get";
import { GetNotificationsByRestaurantId } from "@notifications/handler/get-by-restaurant";
import { GetNotificationsByUserId } from "@notifications/handler/get-by-user";

import { DeleteNotification } from "@notifications/handler/delete";
import { ReadNotification } from "@notifications/handler/read";
import { UpdateNotification } from "@notifications/handler/update";

export default {
  CreateNotification,
  GetNotification,
  GetNotificationsByUserId,
  GetNotificationsByRestaurantId,

  ReadNotification,
  UpdateNotification,
  DeleteNotification,
};
