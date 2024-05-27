import { check, withCheck } from "@gateway/middleware/auth";
import { GetNotificationsByUserIdRequest, Notification } from "@gateway/proto/notification_pb";
import {
  DeleteInput,
  MainAddress,
  RoleInput,
  UpdateUserInput,
  User,
  UserCreateInput,
  changePasswordInput,
  changeRoleInput,
  logInInput,
  validateInput,
} from "@gateway/proto/user_pb";
import { notificationServiceClient } from "@gateway/services/clients/notification.client";
import { createDeliveryPerson } from "@gateway/services/delivery.service";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { Request, Response, Router } from "express";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { userServiceClient } from "../../services/clients/user.client";

export const userRoutes = Router();
userRoutes.get("/api/user/:id", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['id'] = {
             in: 'path',
             required: true,
             type: 'string'
       }*/
  const { id } = req.params;

  // Auth check and :id check
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  if (!(await check(token, { id }))) return res.status(403).json({ message: "Forbidden" });

  try {
    const notifications = (await new Promise((resolve, reject) => {
      notificationServiceClient.getNotificationsByUserId(
        new GetNotificationsByUserIdRequest().setUserId(id),
        (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject().notificationsList);
        },
      );
    })) as Notification.AsObject[];

    const user = await getUser(id);
    return res.status(200).json({ ...user?.toObject(), notifications });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

userRoutes.get("/api/user", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
  } */
  userServiceClient.listUser(new Empty(), (error, response) => {
    if (error) res.status(500).send({ error: error.message });
    else return res.json(response.toObject());
  });
});

userRoutes.post("/api/user/register", (req: Request, res: Response) => {
  /*  #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               firstName: "John",
               lastName: "Doe",
               email: "johnDoe@mail.com",
               password: "password",
               phone: "0642424242",
               country: "France",
               zipCode: "76000",
               street: "7 rue de la paix",
               lat: 49.443232,
               lng: 1.099971,
               roleCode: {'$ref': '#/definitions/RoleCode'},
           }
   } */
  const { firstName, lastName, email, password, phone, country, zipCode, street, lat, lng, roleCode } = req.body;
  const userInput = new UserCreateInput();
  try {
    const address = new MainAddress().setCountry(country).setZipcode(zipCode).setStreet(street).setLat(lat).setLng(lng);
    userInput
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPassword(password)
      .setPhone(phone)
      .setMainaddress(address)
      .setRole(new RoleInput().setCode(roleCode));
  } catch (error) {
    return res.status(500).json({ error });
  }

  userServiceClient.register(userInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

userRoutes.put("/api/user", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
  }
  #swagger.parameters['body'] = {
         in: 'body',
         required: true,
         schema: {
             firstName: "John",
             lastName: "Doe",
             email: "johnDoe@mail.com",
             phone: "0642424242",
             country: "France",
             zipCode: "76000",
             street: "7 rue de la paix",
             lat: 49.443232,
             lng: 1.099971
         }
   } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { firstName, lastName, email, phone, country, zipCode, street, lat, lng } = req.body;
  const userInput = new UpdateUserInput();

  try {
    const address = new MainAddress().setCountry(country).setZipcode(zipCode).setStreet(street).setLat(lat).setLng(lng);
    const user = new User()
      .setId(userId)
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPhone(phone)
      .setMainaddress(address);

    userInput.setUser(user).setToken(token);
  } catch (error) {
    res.status(200).json({ error });
  }

  userServiceClient.updateUser(userInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

userRoutes.delete("/api/user/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
  }
   #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
   } */
  const { id } = req.params;
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];

  // The delete route in the user service implement the user validation
  userServiceClient.deleteUser(new DeleteInput().setId(id).setToken(token), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

userRoutes.post("/api/user/login", (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                email: "johnDoe@mail.com",
                password: "password",
            }
      } */
  const { email, password } = req.body;
  const inInput = new logInInput().setEmail(email).setPassword(password);

  userServiceClient.logIn(inInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

userRoutes.post("/api/user/validate", (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
  } */
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];

  const validate = new validateInput().setToken(token);

  userServiceClient.validate(validate, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

userRoutes.put("/api/user/password", (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      }
     #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            oldpassword: "oldpassword",
            password: "newPassword",
        }
    } */

  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];

  const { oldpassword, password } = req.body;
  const updatePasswordInput = new changePasswordInput();
  try {
    updatePasswordInput.setToken(token).setOldpassword(oldpassword).setNewpassword(password);
  } catch (error) {
    return res.status(500).json({ error });
  }

  userServiceClient.changePassword(updatePasswordInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

userRoutes.put("/api/user/:id/role", async (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     }
     #swagger.parameters['body'] = {
         in: 'body',
         required: true,
         schema: {
             role: {'$ref': '#/definitions/RoleCode'},
         }
 } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  const token = authorization!.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const id = req.params.id;

  // If user is admin, he can change the role of any user
  // If user is not admin, he can only change his own role to delivery person
  const isAdmin = await check(token, { role: "ADMIN" });
  const isSimpleUser = (await check(token, { id })) && !isAdmin;

  if (!isAdmin || (isSimpleUser && req.body.role !== "DELIVERY_PERSON"))
    return res.status(403).json({
      message: "You are not allowed to change the role of this user",
      cause: {
        isAdmin,
        isSimpleUser,
        role: req.body.role,
      },
    });

  // ----------------------------

  const roleInput = new changeRoleInput();

  try {
    roleInput.setToken(token).setUserid(id).setRolecode(req.body.role);
  } catch (error) {
    return res.status(500).json({ error });
  }
  let user: User.AsObject | undefined = undefined;
  try {
    user = await new Promise((resolve, reject) => {
      userServiceClient.changeRole(roleInput, (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject().user);
      });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }

  if (user && user.role?.code === "DELIVERY_PERSON") {
    try {
      await createDeliveryPerson(user.id, user.firstName, user.lastName, user.phone, user.mainaddress);
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
  return res.status(200).json(user);
});
