import "dotenv/config";
import { Bot } from "grammy";
import { session } from "grammy";
import { startHandler } from "./handlers/startHandler.js";
import { Hears } from "../consts/hears.js";
import { uploadVideoHandler } from "./handlers/uploadVideoHandler.js";
import { createFolderHandler } from "./handlers/createFolderHandler.js";
import { HelpHandler } from "./handlers/helpHandler.js";
import { required } from "../utils/env.js";
const BOT_TOKEN = required("BOT_TOKEN");
if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not set in .env file");
}
export const bot = new Bot(BOT_TOKEN);
// , {
//   client: {
//     apiRoot: "http://telegram-api-server:8081",
//   },
// });
bot.use(session({
    initial: () => ({
        step: "idle",
        pendingEmail: "",
    }),
}));
bot.command("start", startHandler);
bot.hears(Hears.CREATE_FOLDER, async (ctx, next) => {
    ctx.session.step = "waitingForGoogleAuth";
    await createFolderHandler(ctx, next);
});
bot.hears(Hears.UPLOAD_VIDEO, async (ctx) => {
    ctx.session.step = "waitingForVideo";
    await ctx.reply(`отправляй видео`);
});
bot.hears(Hears.HELP, HelpHandler);
bot.on("message:video", (ctx, next) => {
    if (ctx.session.step === "waitingForVideo") {
        return uploadVideoHandler(ctx, next);
    }
    return next();
});
