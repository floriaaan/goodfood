import services from '../../proto/metric_grpc_pb';
import * as grpc from '@grpc/grpc-js';

const url = process.env.GATEWAY_REPORTING_URL || "localhost:50020";

export default new services.ReportingServiceClient(
    url,
    grpc.credentials.createInsecure());