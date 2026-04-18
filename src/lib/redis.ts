import {Redis} from "@upstash/redis";

let redisInstance: Redis | null = null;

export function getRedis() {
  if (
    !redisInstance &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    try {
      redisInstance = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });
      console.log("Redis initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
    }
  }
  return redisInstance;
}

export const redis = getRedis();
