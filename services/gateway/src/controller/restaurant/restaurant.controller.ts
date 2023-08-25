import { Request, Response, Router } from "express";
import { restaurantServiceClient } from "@gateway/services/clients/restaurant.client";
import { RestaurantId } from "@gateway/proto/product_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { ByLocationInput, Restaurant, RestaurantCreateInput } from "@gateway/proto/restaurant_pb";
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
            locationList: [1.099, 49.443]
        }
    }
    */

  const { locationList } = req.body;
  restaurantServiceClient.getRestaurantsByLocation(
    new ByLocationInput().setLocationList(locationList),
    (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    },
  );
});

restaurantRoutes.post("/api/restaurant", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            name: "restaurant-name",
            description: "restaurant-desc",
            locationList: [1.099, 49.443],
            address: "restaurant-address",
            openingHoursList:  ["12h-14h", "19h-22h"],
            phone: "restaurant-phone"
        }
    }
    #swagger.parameters['header'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { name, description, locationList, address, openingHoursList, phone } = req.body;
  const restaurantCreateInput = new RestaurantCreateInput()
    .setName(name)
    .setDescription(description)
    .setLocationList(locationList)
    .setAddress(address)
    .setOpeninghoursList(openingHoursList)
    .setPhone(phone);

  restaurantServiceClient.createRestaurant(restaurantCreateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

restaurantRoutes.put(
  "/api/restaurant/:id",
  withCheck({ role: ["ADMIN", "ACCOUNTANT"] }),
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
                locationList: [1.099, 49.443],
                address: "restaurant-address",
                openingHoursList:  ["12h-14h", "19h-22h"],
                phone: "restaurant-phone"
            }
        }
        #swagger.parameters['header'] = {
            in: 'header',
            required: true,
            type: 'string'
        } */
    const { id } = req.params;
    const { name, description, locationList, address, openingHoursList, phone } = req.body;
    const restaurantCreateInput = new Restaurant()
      .setId(id)
      .setName(name)
      .setDescription(description)
      .setLocationList(locationList)
      .setAddress(address)
      .setOpeninghoursList(openingHoursList)
      .setPhone(phone);

    restaurantServiceClient.updateRestaurant(restaurantCreateInput, (error, response) => {
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
     #swagger.parameters['header'] = {
        in: 'header',
        required: true,
        type: 'string'
     }
    */
  const { id } = req.params;

  restaurantServiceClient.deleteRestaurant(new RestaurantId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
