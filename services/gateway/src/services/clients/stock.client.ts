import services from '../../proto/stock_grpc_pb';
import * as grpc from '@grpc/grpc-js';

const url = process.env.GATEWAY_STOCK_URL || "localhost:50009";

export const stockServiceClient = new services.StockServiceClient(
    url,
    grpc.credentials.createInsecure());

export const stockPersonServiceClient = new services.StockReportingServiceClient(
    url,
    grpc.credentials.createInsecure());