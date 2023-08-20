import {User, UserId} from "@gateway/proto/user_pb";
import {userServiceClient} from "@gateway/services/clients/user.client";

export const getUser = (id: number): User | undefined => {
    const userId = new UserId();
    userId.setId(Number(id));
    let user: User | undefined = undefined;
    userServiceClient.getUser(userId, (error, response) => {
        if (error) {
            throw Error(error.message);
        } else {
            user = response.getUser()
        }
    });
    return user;
}
