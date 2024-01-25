import { Request, Response, Router } from "express";
import { CreateCheckoutSessionRequest } from "@gateway/proto/payment_pb";
import { stripeServiceClient } from "@gateway/services/clients/payment.client";
import { getUser, getUserIdFromToken } from "@gateway/services/user.service";
import { basketServiceClient } from "@gateway/services/clients/basket.client";
import { Basket, UserIdRequest } from "@gateway/proto/basket_pb";
import { productServiceClient } from "@gateway/services/clients/product.client";
import { Product, ProductId } from "@gateway/proto/product_pb";

export const stripeRoutes = Router();

// TODO: check if user can modify this payment request
stripeRoutes.post("/api/payment/stripe", async (req: Request, res: Response) => {
  /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                return_url_base: "http://localhost:3000",
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
  const user = await getUser(userId);
  // ----------------------------

  if (!user?.getFirstName() || !user.getLastName() || !user.getEmail())
    return res.status(400).send({ error: "User is missing information" });

  const name = `${user.getFirstName()} ${user.getLastName()}`;
  const email = user.getEmail();

  const basket: Basket.AsObject = await new Promise((resolve, reject) => {
    basketServiceClient.getBasket(new UserIdRequest().setUserId(userId), (error, response) => {
      if (error) reject(error);
      else resolve(response.toObject());
    });
  });

  const products = await Promise.all(
    basket.productsList.map(async (product) => {
      return (await new Promise((resolve, reject) => {
        productServiceClient.readProduct(new ProductId().setId(product.id), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      })) as Product.AsObject;
    }),
  );

  const total = products.reduce((acc, product) => {
    return acc + product.price;
  }, 0);
  console.log(
    total,
    products.length,
    products.map((product) => product.price),
  );

  const createCheckoutSessionRequest = new CreateCheckoutSessionRequest()
    .setUserId(userId.toString())
    .setName(name)
    .setEmail(email)
    .setTotal(total)
    .setReturnUrlBase(req.body.return_url_base);
  stripeServiceClient.createCheckoutSession(createCheckoutSessionRequest, (error, response) => {
    if (error) return res.status(500).send({ error });
    else return res.status(200).json(response.toObject());
  });
});
