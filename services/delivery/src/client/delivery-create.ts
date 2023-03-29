import "dotenv/config";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";

import { options } from "@delivery/resources/protoloader-options";
import { insecure } from "@delivery/resources/grpc-credentials";
import { log } from "@delivery/lib/log";

const PORT = process.env.PORT || 50008;
const ADDRESS = `localhost:${PORT}`;
const PROTO_PATH = __dirname + "/../../../proto/delivery.proto";

const packageDefinition = loadSync(PROTO_PATH, options);
const { delivery } = loadPackageDefinition(packageDefinition) as any;

function main() {
  const client = new delivery.DeliveryService(ADDRESS, insecure);

  /**
   * message DeliveryCreateInput {
     google.protobuf.Timestamp eta = 1;
     string address = 2;
     Status status = 3;
     string delivery_person_id = 4;
    }
   */
  const data = {
    eta: "2022-01-01T00:00:00.000Z",
    address: "10 Rue de la République, 75003 Paris, France",
    status: "PENDING",
    delivery_person_id: "random_id",
  };
  client.CreateDelivery(data, (err: any, response: any) => {
    if (err) log.error(err);
    log.info(response);
  });
}

main();
