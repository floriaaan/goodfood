import { credentials, ServerCredentials } from "@grpc/grpc-js";

export const insecure = credentials.createInsecure();

export const serverInsecure = ServerCredentials.createInsecure();
