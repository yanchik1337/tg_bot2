import "dotenv/config";
import { Bot } from "grammy";
import type { BotContext, SessionData } from "./types/bot-types.js";
import { session } from "grammy";
import { startHandler } from "./handlers/startHandler.js";
import { Hears } from "../consts/hears.js";
import { uploadVideoHandler } from "./handlers/uploadVideoHandler.js";
import { createFolderHandler } from "./handlers/createFolderHandler.js";
import { HelpHandler } from "./handlers/helpHandler.js";
import { isValidEmail, required } from "../utils/env.js";
const BOT_TOKEN = required("BOT_TOKEN");

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set in .env file");
}

export const bot = new Bot<BotContext>(BOT_TOKEN, {
  client: {
    apiRoot: "http://telegram-api-server:8081",
  },
});

bot.use(
  session<SessionData, BotContext>({
    initial: () => ({
      step: "idle",
      pendingEmail: "",
    }),
  }),
);

bot.command("start", startHandler);
bot.hears(Hears.CREATE_FOLDER, async (ctx) => {
  ctx.session.step = "waitingForEmail";
  await ctx.reply("Введи название почты");
});

bot.hears(Hears.UPLOAD_VIDEO, async (ctx) => {
  ctx.session.step = "waitingForVideo";
  await ctx.reply(`отправляй видео`);
});

bot.hears(Hears.HELP, HelpHandler);

bot.on("message:text", async (ctx, next) => {
  if (ctx.session.step === "waitingForVideo") {
    return await ctx.reply("отправь видео");
  }
  if (ctx.session.step === "waitingForEmail") {
    const email = ctx.message.text;
    if (isValidEmail(email)) {
      ctx.session.pendingEmail = email;
      await ctx.reply("Введи название папки");
      return (ctx.session.step = "waitingForFolderName");
    } else {
      await ctx.reply("Укажите правильную почту");
      return;
    }
  }
  if (ctx.session.step === "waitingForFolderName") {
    return createFolderHandler(ctx, next);
  }
  return next();
});

bot.on("message:video", (ctx, next) => {
  if (ctx.session.step === "waitingForVideo") {
    return uploadVideoHandler(ctx, next);
  }

  return next();
});
