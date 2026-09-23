import { z } from "zod";
import { isHttpUrl } from "@/lib/url";

export const generateQrSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .url("Enter a valid URL, including https://")
    .refine(isHttpUrl, "URL must use http or https"),
});

export type GenerateQrInput = z.infer<typeof generateQrSchema>;
