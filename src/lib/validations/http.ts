import { z, ZodError } from "zod";

export function formatZodError(error: ZodError) {
  return z.flattenError(error).fieldErrors;
}

export async function parseJsonBody<T extends z.ZodType>(
  schema: T,
  request: Request,
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; error: ReturnType<typeof formatZodError> }
> {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }

  return { success: true, data: parsed.data };
}
