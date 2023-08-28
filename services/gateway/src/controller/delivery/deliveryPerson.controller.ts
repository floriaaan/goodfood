import { Router } from "express";
import { deliveryPersonServiceClient } from "@gateway/services/clients/delivery.client";
import { DeliveryPerson, DeliveryPersonCreateInput, DeliveryPersonId, Location } from "@gateway/proto/delivery_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { withCheck } from "@gateway/middleware/auth";

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
        type: 'integer'
    }
    #swagger.parameters['lng'] = {
        in: 'query',
        required: true,
        type: 'integer'
    } */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { lat, lng } = req.query as { lat: string; lng: string };
  const location = new Location().setLatitude(Number(lat)).setLongitude(Number(lng));
  deliveryPersonServiceClient.listNearDeliveryPersons(location, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

deliveryPersonRoutes.get("/api/delivery-person/:id", async (req, res) => {
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
            firstName:"John",
            lastName:"Doe",
            phone:"0612345678",
            locationList:[41.40338, 2.17403]
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */

  const { firstName, lastName, phone, locationList } = req.body;
  const deliveryPerson = new DeliveryPersonCreateInput()
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setLocationList(locationList);
  deliveryPersonServiceClient.createDeliveryPerson(deliveryPerson, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

deliveryPersonRoutes.put("/api/delivery-person/:id", withCheck({ role: "ADMIN" }), (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            firstName:"John",
            lastName:"Doe",
            phone:"0612345678",
            locationList:[41.40338, 2.17403]
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { id } = req.params;
  const { firstName, lastName, phone, locationList } = req.body;
  const deliveryPerson = new DeliveryPerson()
    .setId(id)
    .setFirstName(firstName)
    .setLastName(lastName)
    .setPhone(phone)
    .setLocationList(locationList);

  deliveryPersonServiceClient.updateDeliveryPerson(deliveryPerson, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

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
