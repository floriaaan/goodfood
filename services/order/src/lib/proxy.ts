import { Server, status } from "@grpc/grpc-js";

const getType = (method: {
  requestStream: boolean;
  responseStream: boolean;
}) => {
  if (method.requestStream === false && method.responseStream === false) {
    return "unary";
  }
  return "unknown";
};


const lookupServiceMetadata = (service: { [x: string]: any }) => {
  const serviceKeys = Object.keys(service);
  const intersectingMethods = serviceKeys.reduce((acc, k) => {
    const method = service[k];
    if (!method) {
      throw new Error(`cannot find method ${k} on service`);
    }
    const components = method.path.split("/");
    acc[k] = {
      name: components[1],
      method: components[2],
      type: getType(method),
      path: method.path,
      responseType: method.responseType,
      requestType: method.requestType,
    };
    return acc;
  }, {} as any);

  return (key: string) => intersectingMethods[key];
};

export const handler = {
  get(
    target: {
      [x: string]: any;
      intercept: () => any;
      addService: (arg0: any, arg1: {}) => any;
    },
    propKey: string
  ) {
    if (propKey !== "addService") {
      return target[propKey];
    }
    return (service: any, implementation: { [x: string]: any }) => {
      const newImplementation = {} as any;
      const lookup = lookupServiceMetadata(service);
      for (const k in implementation) {
        const name = k;
        const fn = implementation[k];
        newImplementation[name] = (call: any, callback: any) => {
          const ctx = {
            call,
            name,
            service: lookup(name),
            status: {
              code: status.UNKNOWN,
              details: "",
            },
          };
          const newCallback = (callback: (arg0: any) => void) => {
            return (...args: any[]) => {
              ctx.status = {
                code: status.OK,
                details: "",
              };
              const err = args[0];
              if (err) {
                ctx.status = {
                  code: status.UNKNOWN,
                  details: err,
                };
              }
              // @ts-ignore
              callback(...args);
            };
          };

          const interceptors = target.intercept();
          const first = interceptors.next();
          if (!first.value) {
            // if we don't have any interceptors
            return new Promise((resolve) => {
              return resolve(fn(call, newCallback(callback)));
            });
          }
          first.value(ctx, function next() {
            return new Promise((resolve) => {
              const i = interceptors.next();
              if (i.done) {
                return resolve(fn(call, newCallback(callback)));
              }
              return resolve(i.value(ctx, next));
            });
          });
        };
      }
      return target.addService(service, newImplementation);
    };
  },
};

export const createServerProxy = (
  server: Server
): Server & {
  intercept: Generator<any, void, unknown>;
  interceptors: any[];
  use: (fn: any) => void;
} => {
  // @ts-ignore
  server.interceptors = [];
  // @ts-ignore
  server.use = (fn: any) => {
    // @ts-ignore
    server.interceptors.push(fn);
  };
  // @ts-ignore
  server.intercept = function* intercept() {
    let i = 0;
    // @ts-ignore
    while (i < server.interceptors.length) {
      // @ts-ignore
      yield server.interceptors[i];
      i++;
    }
  };
  // @ts-ignore
  return new Proxy(server, handler);
};
