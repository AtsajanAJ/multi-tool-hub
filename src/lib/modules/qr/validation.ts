import { z } from "zod";
import { isHttpUrl } from "@/lib/url";

export const QR_SIZES = [192, 215, 399] as const;
export const QR_ECC_LEVELS = ["L", "M", "Q", "H"] as const;

export const generateQrSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .url("Enter a valid URL, including https://")
    .refine(isHttpUrl, "URL must use http or https"),
  ecc: z.enum(QR_ECC_LEVELS).optional(),
  size: z.number().int().min(70).max(1000).optional(),
  color: z
    .string()
    .trim()
    .regex(/^#?[0-9A-Fa-f]{6}$/, "Enter a hex color")
    .transform((value) => value.replace("#", "").toLowerCase())
    .optional(),
  margin: z.number().int().min(0).max(50).optional(),
});

export type GenerateQrInput = z.infer<typeof generateQrSchema>;
