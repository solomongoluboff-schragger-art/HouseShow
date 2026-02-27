import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://houseshow:houseshow_password@localhost:5432/houseshow_dev?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
