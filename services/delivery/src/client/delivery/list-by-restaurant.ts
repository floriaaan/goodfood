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

function main() {
  const client = new delivery.DeliveryService(ADDRESS, insecure);

  const data = {
    id: "restaurant_id:1",
  };

  const call = client.ListDeliveriesByRestaurant(data);
  const deliveries: Delivery[] = [];
  call.on("data", (delivery: Delivery) => {
    log.debug(`Received delivery: ${delivery.id}`);
    deliveries.push(delivery);
  });
  call.on("end", () => {
    console.log("All deliveries received.");
    log.debug(deliveries);
  });
  call.on("error", (error: Error) => {
    log.debug("Error:", error.message);
  });
}

main();
