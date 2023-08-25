import { User, UserId } from "@gateway/proto/user_pb";
import { userServiceClient } from "@gateway/services/clients/user.client";

export const getUser = (id: number): Promise<User | undefined> => {
    const userId = new UserId();
    userId.setId(Number(id));
    return new Promise((resolve, reject) => {
        userServiceClient.getUser(userId, (error, response) => {
            if (error) {
              reject(error);
            } else {
                resolve(response.getUser())
            }
        });
    })
}
