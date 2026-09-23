import { config } from "dotenv";

export function loadAppEnv() {
  const isProd = process.env.APP_ENV === "production";
  const path = isProd ? ".env.production" : ".env";

  config({
    path,
    override: isProd,
  });

  return path;
}

export function datasourceHost() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  return url?.split("@")[1]?.split("/")[0] ?? "unknown";
}
