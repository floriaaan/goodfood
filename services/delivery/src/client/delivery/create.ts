import "dotenv/config";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";

import { options } from "@delivery/resources/protoloader-options";
import { insecure } from "@delivery/resources/grpc-credentials";
import { log } from "@delivery/lib/log";
import { Delivery } from "@delivery/types/delivery";

const PORT = process.env.PORT || 50008;
const ADDRESS = `localhost:${PORT}`;
const PROTO_PATH = __dirname + "/../../../../proto/delivery.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const { delivery } = loadPackageDefinition(packageDefinition) as any;

const DEFAULT_DATA = {
  eta: "2022-01-01T00:00:00.000Z",
  address: "10 Rue de la République, 75003 Paris, France",
  status: "PENDING",
  delivery_person_id: "random_id",
  restaurant_id: "restaurant_id:1",
  user_id: "user_id:1",
};

export async function main(data = DEFAULT_DATA) {
  const client = new delivery.DeliveryService(ADDRESS, insecure);

  const response: Delivery | null = await client.CreateDelivery(
    data,
    async (err: any, response: any) => {
      if (err) log.debug(err);
      log.debug(response);
      return Promise.resolve(response);
    }
  );

  return response;
}

main();
