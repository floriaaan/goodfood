import { Request, Response, Router } from "express";
import { userServiceClient } from "../../services/clients/user.client";
import {
  changePasswordInput,
  changeRoleInput,
  DeleteInput,
  logInInput,
  MainAddress,
  Role,
  RoleInput,
  UpdateUserInput,
  User,
  UserCreateInput,
  validateInput,
} from "@gateway/proto/user_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import {check, withCheck} from "@gateway/middleware/auth";

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
             type: 'integer'
       }*/
  const { id } = req.params;

  // Auth check and :id check
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  if (!(await check(token, { id: Number(id) }))) return res.status(403).json({ message: "Forbidden" });

  try {
    const user = await getUser(Number(id))
    res.json(user?.toObject());
  } catch (e: any) {
    res.json({ error: e.message });
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
    else res.json(response.toObject());
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
  } catch (e: any) {
    res.json({ error: e.message });
  }

  userServiceClient.register(userInput, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
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

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { firstName, lastName, email, phone, country, zipCode, street, lat, lng, roleCode } = req.body;
  const userInput = new UpdateUserInput();

  try {
    const address = new MainAddress().setCountry(country).setZipcode(zipCode).setStreet(street).setLat(lat).setLng(lng);
    const user = new User()
      .setId(Number(req.params.id))
      .setFirstName(firstName)
      .setLastName(lastName)
      .setEmail(email)
      .setPhone(phone)
      .setMainaddress(address)
      .setRole(new Role().setCode(roleCode));

    userInput.setUser(user).setToken(authorization);
  } catch (e: any) {
    res.json({ error: e.message });
  }

  userServiceClient.updateUser(userInput, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
  });
});

userRoutes.delete('/api/user/:id', (req: Request, res: Response) => {
    /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
  }
   #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
   } */
    const {id} = req.params;
    const {authorization} = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  // The delete route in the user service implement the user validation
  userServiceClient.deleteUser(new DeleteInput().setUserid(Number(id)).setToken(authorization), (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
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
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
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

  const validate = new validateInput().setToken(authorization);

  userServiceClient.validate(validate, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
  });
});

userRoutes.put('/api/user/password', (req: Request, res: Response) => {
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

    const {authorization} = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  const { oldpassword, password } = req.body;
  const updatePasswordInput = new changePasswordInput();
  try {
    updatePasswordInput.setToken(authorization).setOldpassword(oldpassword).setNewpassword(password);
  } catch (e: any) {
    res.json({ error: e.message });
  }

  userServiceClient.changePassword(updatePasswordInput, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response.toObject());
    }
  });
});

userRoutes.put('/api/user/:id/role', withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
    /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }
     #swagger.parameters['body'] = {
         in: 'body',
         required: true,
         schema: {
             role: {'$ref': '#/definitions/RoleCode'},
         }
 } */
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }
    const id = req.params.id;
    const updatePasswordInput = new changeRoleInput();
    try {
        updatePasswordInput
            .setToken(authorization)
            .setUserid(Number(id))
            .setRolecode(req.body.role);
    } catch (e: any) {
        res.json({error: e.message});
    }
    userServiceClient.changeRole(updatePasswordInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});
