import { Request, Response, Router } from "express";
import { mainAddressServiceClient } from "@gateway/services/clients/user.client";
import { MainAddress, MainAddressId, MainAddressUpdateInput } from "@gateway/proto/user_pb";
import { getUserIdFromToken } from "@gateway/services/user.service";
import { check } from "@gateway/middleware/auth";

export const mainAddressRoutes = Router();

mainAddressRoutes.get("/api/user/main-address/:id", async (req: Request, res: Response) => {
  /*  #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      } 
    */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!(await check(token, { id: userId }))) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;
  mainAddressServiceClient.getMainAddress(new MainAddressId().setId(Number(id)), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

mainAddressRoutes.put("/api/user/main-address/:id", async (req: Request, res: Response) => {
  /*  #swagger.parameters['id'] = {
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
      } 
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      } 
    */

  // Auth check and :id check ---
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  const token = authorization.split("Bearer ")[1];
  const userId = await getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!(await check(token, { id: userId }))) return res.status(401).json({ message: "Unauthorized" });
  // ----------------------------

  const { id } = req.params;
  const { country, zipCode, street, lat, lng } = req.body;
  const address = new MainAddress()
    .setId(Number(id))
    .setCountry(country)
    .setZipcode(zipCode)
    .setStreet(street)
    .setLat(lat)
    .setLng(lng);

  const mainAddressUpdateInput = new MainAddressUpdateInput().setToken(token).setMainaddress(address);
  mainAddressServiceClient.updateMainAddress(mainAddressUpdateInput, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
