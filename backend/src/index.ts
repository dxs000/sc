import { PrismaPg } from "@prisma/adapter-pg";
import app from "./app.js";
import prisma from "./prisma.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  const userCount = await prisma.user.count();
  console.log(`✅ Prisma подключена. Пользователей в базе: ${userCount}`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main().catch((e) => {
  console.error("❌ Ошибка при старте (скорее всего Prisma/база):", e);
  process.exit(1);
});