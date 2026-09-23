type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, { windowMs, max }: RateLimitOptions) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
