import { startHanderlKeyboard } from "../keyboards/startHandelrKB.js";
export async function startHandler(ctx) {
    const name = ctx.from?.first_name;
    await ctx.reply(`Привет, ${name}!
    Создавай папку и загружай видео`, { reply_markup: startHanderlKeyboard });
}
