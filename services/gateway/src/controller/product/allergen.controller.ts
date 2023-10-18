import { Request, Response, Router } from "express";
import { allergenServiceClient } from "../../services/clients/product.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Allergen, AllergenId } from "@gateway/proto/product_pb";
import { withCheck } from "@gateway/middleware/auth";

export const allergenRoutes = Router();

// TODO: check if route should be accessible
allergenRoutes.get("/api/allergen", (_: Request, res: Response) => {
  allergenServiceClient.getAllergenList(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

// TODO: check if route should be accessible
allergenRoutes.get("/api/allergen/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  allergenServiceClient.readAllergen(new AllergenId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

allergenRoutes.post("/api/allergen", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            label: "allergen-label",
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { label } = req.body;
  const allergen = new Allergen().setLibelle(label);
  allergenServiceClient.createAllergen(allergen, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

allergenRoutes.put("/api/allergen/:id", withCheck({ role: ["MANAGER", "ADMIN"] }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            label: "allergen-label",
        }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { id } = req.params;
  const { label } = req.body;
  const allergen = new Allergen().setId(id).setLibelle(label);
  allergenServiceClient.updateAllergen(allergen, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

allergenRoutes.delete(
  "/api/allergen/:id",
  withCheck({ role: ["MANAGER", "ADMIN"] }),
  (req: Request, res: Response) => {
    /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }*/
    const { id } = req.params;
    allergenServiceClient.deleteAllergen(new AllergenId().setId(id), (error, response) => {
      if (error) return res.status(500).send({ error });
      else return res.status(200).json(response.toObject());
    });
  },
);
