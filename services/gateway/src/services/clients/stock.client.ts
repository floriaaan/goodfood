import services from '../../proto/stock_grpc_pb';
import * as grpc from "grpc";

// TODO: add stock env
export const stockServiceClient = new services.StockServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());

export const stockPersonServiceClient = new services.StockReportingServiceClient(
    'http://localhost:50007',
    grpc.credentials.createInsecure());