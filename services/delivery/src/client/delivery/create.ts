import "dotenv/config";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";

import { options } from "@delivery/resources/protoloader-options";
import { insecure } from "@delivery/resources/grpc-credentials";
import { log } from "@delivery/lib/log";

const PORT = process.env.PORT || 50008;
const ADDRESS = `localhost:${PORT}`;
const PROTO_PATH = __dirname + "/../../../../proto/delivery.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const { delivery } = loadPackageDefinition(packageDefinition) as any;

function main() {
  const client = new delivery.DeliveryService(ADDRESS, insecure);

  const data = {
    eta: "2022-01-01T00:00:00.000Z",
    address: "10 Rue de la République, 75003 Paris, France",
    status: "PENDING",
    delivery_person_id: "random_id",
    restaurant_id: "restaurant_id:1",
    user_id: "user_id:1",
  };
  client.CreateDelivery(data, (err: any, response: any) => {
    if (err) log.debug(err);
    log.debug(response);
  });
}

main();
