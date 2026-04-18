import {getBot} from "@/lib/bot";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bot = getBot();

    if (!bot) {
      console.error("❌ Bot is not initialized");
      return NextResponse.json(
        {
          ok: false,
          error:
            "Bot not configured. Please check TELEGRAM_TOKEN environment variable.",
        },
        { status: 500 },
      );
    }

    const update = await req.json();
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "Webhook endpoint is working. Use POST to receive updates from Telegram.",
    bot_configured: !!process.env.TELEGRAM_TOKEN,
    redis_configured: !!(
      process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ),
  });
}
