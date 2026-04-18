import {getBot} from "@/lib/bot";
import {getRedis} from "@/lib/redis";
import {NextResponse} from "next/server";

export async function GET() {
  let botStatus = "not_configured";
  let redisStatus = "not_configured";

  // Check bot
  const bot = getBot();
  if (bot) {
    botStatus = "ready";
  } else if (process.env.TELEGRAM_TOKEN) {
    botStatus = "init_failed";
  }

  // Check Redis
  const redis = getRedis();
  if (redis) {
    try {
      await redis.ping();
      redisStatus = "connected";
    } catch {
      redisStatus = "error";
    }
  } else if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redisStatus = "init_failed";
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    bot: {
      configured: !!process.env.TELEGRAM_TOKEN,
      status: botStatus,
    },
    redis: {
      configured: !!(
        process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
      ),
      status: redisStatus,
    },
  });
}
