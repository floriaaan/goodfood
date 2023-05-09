import { Server } from "@grpc/grpc-js";
import { log } from "@order/lib/log";
import { access, constants } from "fs";
import { addReflection as base_addReflection } from "grpc-server-reflection";
import { resolve as resolvePath } from "path";

export const addReflection = (server: Server, path: string) => {
  if (process.env.NODE_ENV === "production") {
    log.warn("Reflection is disabled in production");
    return;
  }

  const resolvedPath = resolvePath(path);
  try {
    access(resolvedPath, constants.R_OK, () => {});

    base_addReflection(server, path);
  } catch (err) {
    console.log("here");
    log.warn(`Reflection file ${resolvedPath} is not readable`);
    return;
  }
};
