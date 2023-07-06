import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { GetOrdersAffluence } from "@order/handlers/reporting/affluence";
import { GetDeliveryTypeRepartition } from "@order/handlers/reporting/delivery-types";
import { GetTop5SellingProducts } from "@order/handlers/reporting/top5-selling";

const reportingHandlers: UntypedServiceImplementation = {
  GetOrdersAffluence,
  GetTop5SellingProducts,
  GetDeliveryTypeRepartition,
};

export default reportingHandlers;
