import {Telegraf} from "telegraf";
import {message} from "telegraf/filters";
import {getRedis} from "./redis";

let botInstance: Telegraf | null = null;

export function getBot() {
  if (!botInstance) {
    if (!process.env.TELEGRAM_TOKEN) {
      console.warn(
        "⚠️ TELEGRAM_TOKEN is not set! Bot features will be disabled.",
      );
      return null;
    }

    try {
      botInstance = new Telegraf(process.env.TELEGRAM_TOKEN);

      // Setup commands
      botInstance.start((ctx) => {
        const userName = ctx.message.from.username || "friend";
        ctx.reply(
          `Welcome ${userName}! 🚀\n\nI'm a bot template. Send /help to see what I can do.`,
        );
      });

      botInstance.help((ctx) =>
        ctx.reply(
          `
Here are the available commands:

/start - Welcome message
/help - Show this help message
/ping - Check if the bot is alive

Send me any text, and I'll echo it back!
        `,
        ),
      );

      botInstance.command("ping", (ctx) =>
        ctx.reply(
          `Pong! 🏓 Latency: ${Date.now() - ctx.message.date * 1000}ms`,
        ),
      );

      // Simple echo functionality with safe Redis
      botInstance.on(message("text"), async (ctx) => {
        const userMessage = ctx.message.text;
        const userId = ctx.message.from.id;

        const redis = getRedis();
        let messageCount = 0;

        if (redis) {
          try {
            await redis.incr(`user:${userId}:messages`);
            const count = await redis.get(`user:${userId}:messages`);
            messageCount = Number(count) || 0;
            ctx.reply(
              `Echo: "${userMessage}"\nThis is your message #${messageCount}.`,
            );
          } catch (error) {
            console.error("Redis error:", error);
            ctx.reply(
              `Echo: "${userMessage}"\n(Redis error - message count unavailable)`,
            );
          }
        } else {
          ctx.reply(
            `Echo: "${userMessage}"\n(Redis not configured - message count disabled)`,
          );
        }
      });

      // Generic handler for other message types
      botInstance.on("message", (ctx) =>
        ctx.reply("I can only process text messages for now."),
      );

      console.log("✅ Bot initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize bot:", error);
      return null;
    }
  }
  return botInstance;
}

// Default export for backward compatibility
export const bot = getBot();
