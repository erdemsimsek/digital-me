import { getSettings } from "./config";

interface RateLimitEntry {
  minuteCount: number;
  minuteStart: number;
  hourCount: number;
  hourStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.hourStart > 3600000) {
      store.delete(key);
    }
  }
}, 300000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const settings = getSettings();
  const { maxRequestsPerMinute, maxRequestsPerHour } = settings.rateLimit;
  const now = Date.now();

  let entry = store.get(ip);
  if (!entry) {
    entry = { minuteCount: 0, minuteStart: now, hourCount: 0, hourStart: now };
    store.set(ip, entry);
  }

  // Reset minute window
  if (now - entry.minuteStart > 60000) {
    entry.minuteCount = 0;
    entry.minuteStart = now;
  }

  // Reset hour window
  if (now - entry.hourStart > 3600000) {
    entry.hourCount = 0;
    entry.hourStart = now;
  }

  // Check minute limit
  if (entry.minuteCount >= maxRequestsPerMinute) {
    const retryAfter = Math.ceil((entry.minuteStart + 60000 - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  // Check hour limit
  if (entry.hourCount >= maxRequestsPerHour) {
    const retryAfter = Math.ceil((entry.hourStart + 3600000 - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  entry.minuteCount++;
  entry.hourCount++;
  return { allowed: true };
}
