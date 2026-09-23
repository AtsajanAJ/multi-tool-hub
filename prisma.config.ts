import { defineConfig } from "prisma/config";
import { datasourceHost, loadAppEnv } from "./src/lib/load-env";

const envFile = loadAppEnv();
console.info(`Prisma env: ${envFile} → ${datasourceHost()}`);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
