import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const basePrisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const prisma = basePrisma.$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, SALT_ROUNDS);
        }
        return query(args);
      },
      async update({ args, query }) {
        if (typeof args.data.password === "string") {
          args.data.password = await bcrypt.hash(args.data.password, SALT_ROUNDS);
        }
        return query(args);
      },
    },
  },
  result: {
    user: {
      isPasswordCorrect: {
        needs: { password: true },
        compute(user) {
          return (candidate: string) => bcrypt.compare(candidate, user.password);
        },
      },
    },
  },
});

export default prisma;