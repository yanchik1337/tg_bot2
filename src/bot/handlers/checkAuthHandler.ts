import { AppDataSource } from "../../config/database.js";
import { OAuth2Client } from "../../config/google.js";
import { User } from "../../entities/User.js";
import { uploadVideoKeyboard } from "../keyboards/uploadVideoKB.js";
import type { BotContext } from "../types/bot-types.js";
const scope_url = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
];

export async function checkAuthHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const userRepository = AppDataSource.getRepository(User);
  const userId = String(ctx.from?.id);
  const userName = String(ctx.from?.first_name);
  const existingUser = await userRepository.findOne({
    where: { telegramId: userId },
  });

  let currentUser;
  if (!existingUser) {
    currentUser = userRepository.create({
      telegramId: userId,
      username: userName,
    });
    await userRepository.save(currentUser);
  } else {
    currentUser = existingUser;
  }

  const userToken = currentUser.googleAuthToken;
  if (!userToken) {
    const authURL = OAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scope_url,
      prompt: "consent select_account",
      state: userId,
    });
    await ctx.reply(`Необходимо авторизоваться в аккаунте: ${authURL}`);
    return;
  }
  ctx.session.step = "waitingForFolderName";
  await ctx.reply(`скидывай название папки!`);
  return;
}
