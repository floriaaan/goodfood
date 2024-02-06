import { Router } from "express";
import { deliveryPersonServiceClient } from "@gateway/services/clients/delivery.client";
import {
  Address,
  DeliveryPerson,
  DeliveryPersonCreateInput,
  DeliveryPersonId,
  DeliveryPersonUpdateLocationInput,
  DeliveryPersonUserId,
  Location,
} from "@gateway/proto/delivery_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { withCheck } from "@gateway/middleware/auth";
import { log } from "@gateway/lib/log/log";

export const deliveryPersonRoutes = Router();

deliveryPersonRoutes.get("/api/delivery-person", withCheck({ role: "ADMIN" }), async (_, res) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
   } */
  deliveryPersonServiceClient.listDeliveryPersons(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.get("/api/delivery-person/near", async (req, res) => {
  /* #swagger.parameters['lat'] = {
        in: 'query',
        required: true,
        type: 'float'
    }
    #swagger.parameters['lng'] = {
        in: 'query',
        required: true,
        type: 'float'
    }
    #swagger.parameters['radius'] = {
        in: 'query',
        required: true,
        type: 'float'
    }
    */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { lat, lng, radius } = req.query as { lat: string; lng: string; radius: string };
  const location = new Location().setLatitude(Number(lat)).setLongitude(Number(lng)).setRadiusInKm(Number(radius));
  deliveryPersonServiceClient.listNearDeliveryPersons(location, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.get("/api/delivery-person/near/user", async (req, res) => {
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const user = await getUser(userId);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  const lat = user.getMainaddress()?.getLat();
  const lng = user.getMainaddress()?.getLng();

  const location = new Location().setLatitude(Number(lat)).setLongitude(Number(lng)).setRadiusInKm(10);
  deliveryPersonServiceClient.listNearDeliveryPersons(location, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.get("/api/delivery-person/by-user", withCheck({ role: "DELIVERY_PERSON" }), async (req, res) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  deliveryPersonServiceClient.getDeliveryPersonByUser(new DeliveryPersonUserId().setId(userId), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.get("/api/delivery-person/:id", async (req, res) => {
  /* #swagger.parameters['id'] = {
        in: 'query',
        required: true,
        type: 'string'
    }
  
  #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
  } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;

  deliveryPersonServiceClient.getDeliveryPerson(new DeliveryPersonId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.post("/api/delivery-person", withCheck({ role: "ADMIN" }), async (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            userId:"userId",
            firstName:"John",
            lastName:"Doe",
            phone:"0612345678",
            address: {
                street: "street",
                city: "city",
                zipcode: "zipcode",
                country: "country",
                lat: 0,
                lng: 0
            }
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  const { userId, firstName, lastName, phone, address } = req.body;
  const deliveryPerson = new DeliveryPersonCreateInput()
    .setUserId(userId)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setAddress(
      new Address()
        .setStreet(address.street)
        .setCity(address.city)
        .setZipcode(address.zipcode)
        .setCountry(address.country)
        .setLat(address.lat)
        .setLng(address.lng),
    );
  deliveryPersonServiceClient.createDeliveryPerson(deliveryPerson, (error, response) => {
    log.error(error);
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

deliveryPersonRoutes.put("/api/delivery-person/:id", withCheck({ role: "ADMIN" }), (req, res) => {
  /* #swagger.parameters['id'] = {
        in: 'query',
        required: true,
        type: 'string'
    }
  #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            firstName:"John",
            lastName:"Doe",
            phone:"0612345678",
            address: {
                street: "street",
                city: "city",
                zipcode: "zipcode",
                country: "country",
                lat: 0,
                lng: 0
            }
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  const { id } = req.params;
  const { firstName, lastName, phone, address } = req.body;
  const deliveryPerson = new DeliveryPerson()
    .setId(id)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setAddress(
      new Address()
        .setStreet(address.street)
        .setCity(address.city)
        .setZipcode(address.zipcode)
        .setCountry(address.country)
        .setLat(address.lat)
        .setLng(address.lng),
    );

  deliveryPersonServiceClient.updateDeliveryPerson(deliveryPerson, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.put(
  "/api/delivery-person/:id/location",
  withCheck({ role: ["DELIVERY_PERSON", "ADMIN"] }),
  (req, res) => {
    /* 
  #swagger.parameters['id'] = {
        in: 'query',
        required: true,
        type: 'string'
    }
  #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            address: {
                street: "street",
                city: "city",
                zipcode: "zipcode",
                country: "country",
                lat: 0,
                lng: 0
            }
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

    const { id } = req.params;
    const { address } = req.body;
    const request = new DeliveryPersonUpdateLocationInput()
      .setDeliveryPersonId(id)
      .setAddress(
        new Address()
          .setStreet(address.street)
          .setCity(address.city)
          .setZipcode(address.zipcode)
          .setCountry(address.country)
          .setLat(address.lat)
          .setLng(address.lng),
      );

    deliveryPersonServiceClient.updateDeliveryPersonLocation(request, (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);

deliveryPersonRoutes.delete("/api/delivery-person/:id", withCheck({ role: "ADMIN" }), (req, res) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  const { id } = req.params;

  deliveryPersonServiceClient.deleteDeliveryPerson(new DeliveryPersonId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
