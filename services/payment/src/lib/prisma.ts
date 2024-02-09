import { Prisma, PrismaClient } from "@prisma/client";

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

export default prisma;

export { prisma };
