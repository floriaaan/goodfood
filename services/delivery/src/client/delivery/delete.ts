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
    id: "clfwvdqdg0000eun46hcudaec", // Change this to a valid delivery id
  };
  client.DeleteDelivery(data, (err: any, response: any) => {
    if (err) log.debug(err);
    log.debug(response);
  });
}

main();
