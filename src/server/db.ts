import { PrismaClient } from "@prisma/client";

import { env } from "rbrgs/utils/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export type DB = typeof db;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
