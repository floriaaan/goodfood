import { User, UserId, validateInput } from "@gateway/proto/user_pb";
import { userServiceClient } from "@gateway/services/clients/user.client";

export const getUser = (id: string): Promise<User | undefined> => {
  const userId = new UserId();
  userId.setId(id);
  return new Promise((resolve, reject) => {
    userServiceClient.getUser(userId, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response.getUser());
      }
    });
  });
};

export const getUserIdFromToken = (token: string): Promise<string | undefined> => {
  const userToken = new validateInput();
  userToken.setToken(token);
  return new Promise((resolve, reject) => {
    userServiceClient.validate(userToken, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response.getId());
      }
    });
  });
};
