import { afterAll, describe, expect, it } from "vitest";
import server from "@delivery/server";
import { main as client_createDelivery } from "@delivery/client/delivery/create";
import { Status } from "@prisma/client";

afterAll(
  async () =>
    new Promise((resolve) => {
      resolve(
        server.tryShutdown((err) => {
          if (err) console.log(err);
          console.log("Server stopped");
        })
      );
    })
);

/*
Code Analysis

Objective:
The main objective of the "main" function is to create a new delivery by calling the "CreateDelivery" method of the "DeliveryService" client and return the response.

Inputs:
- "data" (optional): an object containing delivery data. If not provided, default data will be used.

Flow:
1. Create a new instance of the "DeliveryService" client with the specified address and insecure credentials.
2. Call the "CreateDelivery" method of the client with the provided data.
3. Handle any errors or responses returned by the method.
4. Return the response.

Outputs:
- "response": a Delivery object or null if an error occurred.

Additional aspects:
- The function uses the "insecure" credentials and the address specified in the "ADDRESS" constant.
- The function uses the "DEFAULT_DATA" constant if no data is provided.
- The function logs any errors or responses using the "log.debug" function.
- The function returns a Promise that resolves to the response.
*/

describe("GRPC: create a Delivery object", () => {
  // Tests that the function returns a delivery object with default data when no delivery data is provided.
  it("test_default_data", async () => {
    const response = await client_createDelivery();
    expect(response).toMatchObject({
      eta: "2022-01-01T00:00:00.000Z",
      address: "10 Rue de la République, 75003 Paris, France",
      status: Status.PENDING,
      delivery_person_id: "random_id",
      restaurant_id: "restaurant_id:1",
      user_id: "user_id:1",
    });
  });

  // Tests that the function returns a delivery object when valid delivery data is provided.
  it("test_valid_data", async () => {
    const data = {
      eta: "2022-01-01T00:00:00.000Z",
      address: "123 Main St, Anytown USA",
      status: Status.IN_PROGRESS,
      delivery_person_id: "random_id",
      restaurant_id: "restaurant_id:2",
      user_id: "user_id:3",
    };
    const response = await client_createDelivery(data);
    expect(response).toMatchObject(data);
  });

  // Tests that the function returns null when invalid delivery data is provided.
  it("test_invalid_data", async () => {
    const data = {
      eta: "invalid_date_format",
      address: "",
      status: "INVALID_STATUS",
      delivery_person_id: "",
      restaurant_id: "",
      user_id: "",
    };
    const response = await client_createDelivery(data);
    expect(response).toBeNull();
  });
});
