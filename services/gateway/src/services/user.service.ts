import { User, UserId, validateInput } from "@gateway/proto/user_pb";
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
};

export const getUserIdFromToken = (token: string): Promise<number | undefined> => {
  const userToken = new validateInput();
  userToken.setToken(token);
    return new Promise((resolve, reject) => {
      userServiceClient.validate(userToken, (error, response) => {
            if (error) {
                reject(error);
            } else {
              resolve(response.getUserid());
            }
      });
    });
};

export const user_service_promises = {
  getUser: (id: number): Promise<User | undefined> => {
    const userId = new UserId();
    userId.setId(Number(id));
    return new Promise((resolve, reject) => {
      userServiceClient.getUser(userId, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.getUser());
        }
      });
    });
  },
  getUserIdFromToken: (token: string): Promise<number | undefined> => {
    const userToken = new validateInput();
    userToken.setToken(token);
    return new Promise((resolve, reject) => {
      userServiceClient.validate(userToken, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.getUserid());
        }
      });
    });
  },
};
