import { publish } from "@delivery/lib/amqp";
import { utils } from "@delivery/lib/log";
import { log } from "@delivery/lib/log";

type Context = {
  call: {
    request: Map<string, any>;
  };
  service: {
    path: string;
  };
};

const parseContext = (ctx: Context) => {
  const {
    call: { request },
    service: { path },
  } = ctx;
  return { request, path };
};

export const msg = (
  type: "GRPC" | "AMQP",
  path: string | undefined,
  requestAt: Date,
  responseAt: Date
) =>
  `${utils.magenta(requestAt.toISOString())} | ${utils[
    type === "GRPC" ? "cyan" : "red"
  ](type)}${path ? ` | ${utils.yellow(path)}` : ""} | ${utils.green(
    responseAt.getTime() - requestAt.getTime() + "ms"
  )} |`;

export const logGRPC = async (ctx: Context, next: () => Promise<void>) => {
  const requestAt = new Date();
  await next();
  const responseAt = new Date();
  const { request, path } = parseContext(ctx);
  publish({ request, path }, "log");
  log.debug(msg("GRPC", path, requestAt, responseAt), JSON.stringify(request));
};