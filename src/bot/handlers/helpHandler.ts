import type { BotContext } from "../types/bot-types.js";
export async function HelpHandler(ctx: BotContext) {
  await ctx.reply(`
  /start - начать работу.
  я бот для создания папки в googleDisk
  а также добавления видео
 `);
}
