import { Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import { redis } from "@delivery/lib/redis";

let prisma: PrismaClient;
type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient;
};

const OPTIONS: Prisma.PrismaClientOptions = {
  log:
    process.env.NEXT_PUBLIC_APP_ENV !== "production"
      ? ["info", "warn"]
      : undefined,
};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(OPTIONS);
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Otherwise, a new client will be created on every reload
  if (!("prisma" in global)) {
    (global as GlobalWithPrisma).prisma = new PrismaClient(OPTIONS);
  }

  prisma = (global as GlobalWithPrisma).prisma;
}

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "DeliveryPerson", cacheTime: 300, cacheKey: "delivery_person" },
  ],
  storage: {
    type: "redis",
    options: { client: redis, invalidation: { referencesTTL: 300 } },
  },
  cacheTime: 300,
});

//todo: change to $extends when it's available for prisma-redis-middleware
prisma.$use(cacheMiddleware);

export default prisma;

export { prisma };
