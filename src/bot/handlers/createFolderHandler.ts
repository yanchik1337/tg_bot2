import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import { createFolder } from "../../services/googleDrive.js";
import { uploadVideoKeyboard } from "../keyboards/uploadVideoKB.js";
import type { BotContext } from "../types/bot-types.js";

export async function createFolderHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const userRepository = AppDataSource.getRepository(User);
  const userId = String(ctx.from?.id);
  const userName = String(ctx.from?.first_name);
  const userEmail = ctx.session.pendingEmail;
  if (!userEmail) {
    await ctx.reply("Почта не указана");
    ctx.session.pendingEmail = "";
    return;
  }
  const existingUser = await userRepository.findOne({
    where: { telegramId: userId },
  });
  let currentUser;
  if (!existingUser) {
    currentUser = userRepository.create({
      telegramId: userId,
      username: userName,
      googleAccountEmail: userEmail,
    });
    await userRepository.save(currentUser);
  } else {
    currentUser = existingUser;
  }

  const data = String(ctx.message?.text);
  const newFolderId = await createFolder(data, userEmail);

  currentUser.googleDriveFolderId = newFolderId;
  currentUser.googleDriveFolderName = data;
  await userRepository.save(currentUser);

  ctx.session.step = "waitingForVideo";
  await ctx.reply("Папка успешно создана, скидывай видос", {
    reply_markup: uploadVideoKeyboard,
  });
}
