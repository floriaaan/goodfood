import { publish } from "@product/lib/amqp";
import { utils } from "@product/lib/log";
import { log } from "@product/lib/log";

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
		call,
		service,
	} = ctx || {};

	const {
		request
	} = call || {};
	const {
		path
	} = service || { path: "" };

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
	let { request, path } = parseContext(ctx);
	path = path?.split('.').at(-1) || '';
	publish({ request, path }, "log");
	log.debug(msg("GRPC", path, requestAt, responseAt), JSON.stringify(request));
};