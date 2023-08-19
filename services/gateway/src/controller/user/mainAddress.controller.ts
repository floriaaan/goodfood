import {Request, Response, Router} from 'express';
import {mainAddressServiceClient} from "@gateway/services/clients/user.client";
import {MainAddress, MainAddressId, MainAddressUpdateInput} from "@gateway/proto/user_pb";

export const userRoutes = Router();

userRoutes.get('/api/user/main-address/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    mainAddressServiceClient.getMainAddress(new MainAddressId().setId(Number(id)), (err, response) => {
        if (err) {
            return res.status(500).json({message: err.message});
        }
        return res.json(response.toObject());
    });
});

userRoutes.put('/api/user/main-address/:id', async (req: Request, res: Response) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }

    const {country, zipCode, street, lat, lng} = req.body;
    const address = new MainAddress().setCountry(country).setZipcode(zipCode).setStreet(street).setLat(lat).setLng(lng)

    const mainAddressUpdateInput = new MainAddressUpdateInput().setToken(authorization).setMainaddress(address)
    mainAddressServiceClient.updateMainAddress(mainAddressUpdateInput, (err, response) => {
        if (err) {
            return res.status(500).json({message: err.message});
        }
        return res.json(response.toObject());
    });
});