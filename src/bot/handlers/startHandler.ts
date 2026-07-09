import { Hears } from "../../consts/hears.js";
import { startHanderlKeyboard } from "../keyboards/startHandelrKB.js";
import type { BotContext } from "../types/bot-types.js";
export async function startHandler(ctx: BotContext) {
  const name = ctx.from?.first_name;
  await ctx.reply(
    `Привет, ${name}!
    Создавай папку и загружай видео`,

    { reply_markup: startHanderlKeyboard },
  );
}
