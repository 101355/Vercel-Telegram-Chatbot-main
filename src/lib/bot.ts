import {Telegraf} from "telegraf";
import {message} from "telegraf/filters";

let botInstance: Telegraf | null = null;

export function getBot() {
  if (!botInstance && process.env.TELEGRAM_TOKEN) {
    try {
      botInstance = new Telegraf(process.env.TELEGRAM_TOKEN);

      // Basic commands
      botInstance.start((ctx) => {
        ctx.reply("Welcome! I am your Telegram bot. 🤖");
      });

      botInstance.help((ctx) => {
        ctx.reply(
          "Commands:\n/start - Welcome\n/help - This message\n/ping - Check status",
        );
      });

      botInstance.command("ping", (ctx) => {
        ctx.reply("Pong! 🏓");
      });

      botInstance.on(message("text"), (ctx) => {
        ctx.reply(`Echo: ${ctx.message.text}`);
      });

      console.log("Bot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize bot:", error);
    }
  }
  return botInstance;
}

// Default export for backward compatibility
export const bot = getBot();
