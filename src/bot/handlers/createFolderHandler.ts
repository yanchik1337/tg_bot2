import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import { createFolder } from "../../services/googleDrive.js";
import { required } from "../../utils/env.js";
import { uploadVideoKeyboard } from "../keyboards/uploadVideoKB.js";
import type { BotContext } from "../types/bot-types.js";

const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const scope_url = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
];

export async function createFolderHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const userRepository = AppDataSource.getRepository(User);
  const userId = String(ctx.from?.id);
  const existingUser = await userRepository.findOne({
    where: { telegramId: userId },
  });

  const userToken = existingUser!.googleAuthToken;
  if (!userToken) {
    await ctx.reply(`Необходимо авторизоваться!`);
    return;
  }

  const data = String(ctx.message?.text);
  const newFolderId = await createFolder(data, userToken!);
  existingUser!.googleDriveFolderId = newFolderId;
  existingUser!.googleDriveFolderName = data;
  await userRepository.save(existingUser!);

  ctx.session.step = "waitingForVideo";
  await ctx.reply("Папка успешно создана, скидывай видос", {
    reply_markup: uploadVideoKeyboard,
  });
}
