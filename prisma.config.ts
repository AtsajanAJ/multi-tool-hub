import { config } from "dotenv";
import { defineConfig } from "prisma/config";

if (!process.env.DIRECT_URL) {
  config({
    path: process.env.APP_ENV === "production" ? ".env.production" : ".env",
  });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
