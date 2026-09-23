import { z } from "zod";
export const generateQrSchema = z.object({
    url: z.string().url(),
})
export type GenerateQrInput = z.infer<typeof generateQrSchema>;