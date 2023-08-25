import { Request, Response, Router } from "express";
import { categoryServiceClient } from "../../services/clients/product.client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Category, CategoryId } from "@gateway/proto/product_pb";
import { withCheck } from "@gateway/middleware/auth";

export const categoryRoutes = Router();

categoryRoutes.get("/api/category", (_: Request, res: Response) => {
  categoryServiceClient.getCategoryList(new Empty(), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

categoryRoutes.get("/api/category/:id", (req: Request, res: Response) => {
  /* #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
  const { id } = req.params;

  categoryServiceClient.readCategory(new CategoryId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

categoryRoutes.post("/api/category", withCheck({ role: "ACCOUNTANT" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                label: "category-label",
                icon: "category-icon",
                hexaColor: "#ffffff",
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    } */
  const { label, icon, hexaColor } = req.body;
  const category = new Category().setLibelle(label).setIcon(icon).setHexaColor(hexaColor);
  categoryServiceClient.createCategory(category, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(201).json(response.toObject());
  });
});

categoryRoutes.put("/api/category/:id", withCheck({ role: "ACCOUNTANT" }), (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                label: "category-label",
                icon: "category-icon",
                hexaColor: "#ffffff",
            }
    }
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
  const { id } = req.params;
  const { label, icon, hexaColor } = req.body;
  const category = new Category().setId(id).setLibelle(label).setIcon(icon).setHexaColor(hexaColor);
  categoryServiceClient.updateCategory(category, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});

categoryRoutes.delete("/api/category/:id", withCheck({ role: "ACCOUNTANT" }), (req: Request, res: Response) => {
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
     #swagger.parameters['id'] = {
           in: 'path',
           required: true,
           type: 'string'
     } */
  const { id } = req.params;
  categoryServiceClient.deleteCategory(new CategoryId().setId(id), (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
