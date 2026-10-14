import { PrismaNeon } from "@import { PrismaNeon } from "@import { PrismaNeon } fr/gimport { PrismaNeon } from "@imporobimport { PrismaNeon } from "@import { PrismaNeon } from "@import { PrismaNeon } fr/giPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
