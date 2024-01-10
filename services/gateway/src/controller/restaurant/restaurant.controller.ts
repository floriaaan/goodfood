import { Request, Response, Router } from "express";
import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

import {
  ByLocationInput,
  Restaurant,
  RestaurantId,
  RestaurantCreateInput,
  RestaurantDeleteInput,
  Address,
} from "@gateway/proto/restaurant_pb";
import { withCheck } from "@gateway/middleware/auth";

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
