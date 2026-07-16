import { google } from "googleapis";
import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import type { BotContext } from "../types/bot-types.js";
import { required } from "../../utils/env.js";

const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
export async function exitAccountHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const userRepository = AppDataSource.getRepository(User);
  const userId = String(ctx.from?.id);
  const user = await userRepository.findOne({
    where: { telegramId: userId },
  });

  if (!user || !user.googleAuthToken) {
    await ctx.reply(`Вы не авторизованы!`);
    return;
  }
  const client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  try {
    await client.revokeToken(user.googleAuthToken);
  } catch (e) {
    console.warn(`Ошибка удаления токена`, e);
  }
  const email = user.googleAccountEmail;
  user.googleAuthToken = null as any;
  user.googleAccountEmail = null as any;
  await userRepository.save(user);
  await ctx.reply(`Вы успешно вышли из аккаунта ${email}.`);
}
