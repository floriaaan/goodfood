import services from '../../proto/metric_grpc_pb';
import * as grpc from "grpc";

// TODO: add metric env
export default new services.ReportingServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());