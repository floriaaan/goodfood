import { UntypedServiceImplementation } from "@grpc/grpc-js";

import { GetOutcomesByRestaurant } from "@stock/handlers/reporting/outcomes";

const reportingHandlers: UntypedServiceImplementation = {
  GetOutcomesByRestaurant,
};

export default reportingHandlers;
