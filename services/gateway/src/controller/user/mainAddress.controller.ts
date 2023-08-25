import {Request, Response, Router} from 'express';
import {mainAddressServiceClient} from "@gateway/services/clients/user.client";
import {MainAddress, MainAddressId, MainAddressUpdateInput} from "@gateway/proto/user_pb";

export const mainAddressRoutes = Router();

mainAddressRoutes.get('/api/user/main-address/:id', async (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }*/
    const {id} = req.params;
    mainAddressServiceClient.getMainAddress(new MainAddressId().setId(Number(id)), (err, response) => {
        if (err) {
            return res.status(500).json({message: err.message});
        }
        return res.json(response.toObject());
    });
});

mainAddressRoutes.put('/api/user/main-address/:id', async (req: Request, res: Response) => {
    /* #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }
     #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                country: "France",
                zipCode: "76000",
                street: "7 rue de la paix",
                lat: 49.443232,
                lng: 1.099971
            }
    } */
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }

    const {id} = req.params;
    const {country, zipCode, street, lat, lng} = req.body;
    const address = new MainAddress().setId(Number(id)).setCountry(country).setZipcode(zipCode).setStreet(street).setLat(lat).setLng(lng)

    const mainAddressUpdateInput = new MainAddressUpdateInput().setToken(authorization).setMainaddress(address)
    mainAddressServiceClient.updateMainAddress(mainAddressUpdateInput, (err, response) => {
        if (err) {
            return res.status(500).json({message: err.message});
        }
        return res.json(response.toObject());
    });
});