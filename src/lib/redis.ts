import {Redis} from "@upstash/redis";

// Build time မှာ error မဖြစ်အောင် conditional initialization
let redisInstance: Redis | null = null;

export function getRedis() {
  // Runtime မှာမှ initialize လုပ်ပါ
  if (!redisInstance) {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn(
        "⚠️ Redis environment variables are not set. Redis features will be disabled.",
      );
      return null;
    }

    try {
      redisInstance = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });
      console.log("✅ Redis initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Redis:", error);
      return null;
    }
  }
  return redisInstance;
}

// Default export for backward compatibility (သတိထားသုံးပါ)
export const redis = getRedis();
