import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";
import { Request, Response, Router } from "express";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

import { withCheck } from "@gateway/middleware/auth";
import {
  Address,
  ByLocationInput,
  Restaurant,
  RestaurantCreateInput,
  RestaurantDeleteInput,
  RestaurantId,
} from "@gateway/proto/restaurant_pb";
import { User } from "@gateway/proto/user_pb";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";

export const restaurantRoutes = Router();

restaurantRoutes.get("/api/restaurant/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
    } */
  const { id } = req.params;

  restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

restaurantRoutes.get("/api/restaurant/:id/users", async (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
     }
     #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
     }
    */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized", cause: "authorization not found" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized", cause: "userId not found" });
  const user = await getUser(userId);
  if (!user) return res.status(401).json({ message: "Unauthorized", cause: "user not found" });

  const role = user.getRole()?.getCode();
  if (role === undefined) return res.status(401).json({ message: "Unauthorized", cause: "role is undefined" });
  if (role !== "ADMIN" && role !== "MANAGER")
    return res.status(401).json({ message: "Unauthorized", cause: "role is not ADMIN or MANAGER" });
  // ----------------------------

  const { id } = req.params;

  try {
    const restaurant = (await new Promise((resolve, reject) => {
      restaurantServiceClient.getRestaurant(new RestaurantId().setId(id), (error, response) => {
        if (error) reject(error);
        else resolve(response.toObject());
      });
    })) as Restaurant.AsObject;
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (!restaurant.useridsList.includes(userId) && role !== "ADMIN")
      return res.status(401).json({ message: "Unauthorized", cause: "user is not in restaurant and is not ADMIN" });

    const users = await Promise.all(
      restaurant.useridsList.map(async (userId) => await getUser(userId).catch(() => undefined)),
    ); // TODO (maybe): create user service method to get multiple users

    return res.status(200).json({
      usersList: (users.filter(Boolean) as User[]).map((u) => ({
        id: u.getId(),
        email: u.getEmail(),
        firstname: u.getFirstName(),
        lastname: u.getLastName(),
        role: u.getRole()?.toObject(),
      })), // to match list responses
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

restaurantRoutes.get("/api/restaurant", (_: Request, res: Response) => {
  restaurantServiceClient.getRestaurants(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

restaurantRoutes.post("/api/restaurant/by-location", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            lat: 49.443,
            lng: 1.099
        }
    }
    */

  const { lat, lng } = req.body;
  restaurantServiceClient.getRestaurantsByLocation(new ByLocationInput().setLat(lat).setLng(lng), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

restaurantRoutes.post("/api/restaurant", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            name: "restaurant-name",
            description: "restaurant-desc",
            address: {
                street: "restaurant-street",
                city: "restaurant-city",
                zipCode: "restaurant-postalCode",
                country: "restaurant-country",
                lat: 49.443,
                lng: 1.099
            },
            openingHoursList:  ["12h-14h", "19h-22h"],
            phone: "restaurant-phone",
            userIds: ["user-id-1", "user-id-2"]
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { name, description, address, openingHoursList, phone, userIds } = req.body;

  const restaurantCreateInput = new RestaurantCreateInput()
    .setName(name)
    .setDescription(description)
    .setAddress(
      new Address()
        .setStreet(address.street)
        .setCity(address.city)
        .setZipcode(address.zipCode)
        .setCountry(address.country)
        .setLat(address.lat)
        .setLng(address.lng),
    )
    .setOpeninghoursList(openingHoursList)
    .setPhone(phone)
    .setUseridsList(userIds);

  restaurantServiceClient.createRestaurant(restaurantCreateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

restaurantRoutes.put(
  "/api/restaurant/:id",
  withCheck({ role: ["ADMIN", "MANAGER"] }),
  (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
            in: 'path',
            required: true,
           type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "restaurant-name",
                description: "restaurant-desc",
                address: {
                    street: "restaurant-street",
                    city: "restaurant-city",
                    zipCode: "restaurant-postalCode",
                    country: "restaurant-country",
                    lat: 49.443,
                    lng: 1.099
                },
                openingHoursList:  ["12h-14h", "19h-22h"],
                phone: "restaurant-phone",
                userIds: ["user-id-1", "user-id-2"]
            }
        }
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            type: 'string'
        } */
    const { id } = req.params;
    const { name, description, address, openingHoursList, phone, userIds } = req.body;
    const restaurantInput = new Restaurant()
      .setId(id)
      .setName(name)
      .setDescription(description)
      .setAddress(
        new Address()
          .setStreet(address.street)
          .setCity(address.city)
          .setZipcode(address.zipCode)
          .setCountry(address.country)
          .setLat(address.lat)
          .setLng(address.lng),
      )
      .setOpeninghoursList(openingHoursList)
      .setPhone(phone)
      .setUseridsList(userIds);

    restaurantServiceClient.updateRestaurant(restaurantInput, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

restaurantRoutes.delete("/api/restaurant/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string'
     }
     #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
     }
    */
  const { id } = req.params;
  const restaurantId = new RestaurantDeleteInput().setId(id.toString());

  restaurantServiceClient.deleteRestaurant(restaurantId, (error, response) => {
    console.log({ error, response });
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
