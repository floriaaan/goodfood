import {Router} from "express";
import {deliveryPersonServiceClient} from "@gateway/services/clients/delivery.client";
import {DeliveryPerson, DeliveryPersonCreateInput, DeliveryPersonId, Location} from "@gateway/proto/delivery_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export const deliveryPersonRoutes = Router();

deliveryPersonRoutes.get('/api/delivery-person/:id', (req, res) => {
    const {id} = req.params;

    deliveryPersonServiceClient.getDeliveryPerson(new DeliveryPersonId().setId(id), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryPersonRoutes.get('/api/delivery-person', (req, res) => {
    deliveryPersonServiceClient.listDeliveryPersons(new Empty(), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryPersonRoutes.get('/api/delivery-person', (req, res) => {
    const {lat, lng} = req.body;
    const location = new Location()
        .setLatitude(lat)
        .setLongitude(lng);
    deliveryPersonServiceClient.listNearDeliveryPersons(location, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryPersonRoutes.post('/api/delivery-person', (req, res) => {
    const {firstName, lastName, phone, locationList} = req.body;
    const deliveryPerson = new DeliveryPersonCreateInput()
        .setFirstName(firstName)
        .setLastName(lastName)
        .setPhone(phone)
        .setLocationList(locationList);
    deliveryPersonServiceClient.createDeliveryPerson(deliveryPerson, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryPersonRoutes.put('/api/delivery-person/:id', (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, phone, locationList} = req.body;
    const deliveryPerson = new DeliveryPerson().setId(id)
        .setFirstName(firstName)
        .setLastName(lastName)
        .setPhone(phone)
        .setLocationList(locationList);

    deliveryPersonServiceClient.updateDeliveryPerson(deliveryPerson, (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

deliveryPersonRoutes.delete('/api/delivery-person/:id', (req, res) => {
    const {id} = req.params;

    deliveryPersonServiceClient.deleteDeliveryPerson(new DeliveryPersonId().setId(id), (error, response) => {
        if (error) {
            res.json({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});