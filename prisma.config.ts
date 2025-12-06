import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // engine: "classic", // 已移除：PrismaConfig 类型中不存在 engine 属性
  datasource: {
    url: env("DATABASE_URL"),
  },
});
