import http from "http";
import { OAuth2Client } from "../config/google.js";
import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";
import { google } from "googleapis";
import { required } from "../utils/env.js";
import { bot } from "./bot.js";

const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const userRepository = AppDataSource.getRepository(User);
export const server = http.createServer(async (req, res) => {
  const code = new URL(
    req.url!,
    "http://localhost:3000/oauth2callback",
  ).searchParams.get("code");
  if (!code) {
    return res.end(`параматер ${code} не задан`);
  }
  const state = new URL(
    req.url!,
    "http://localhost:3000/oauth2callback",
  ).searchParams.get("state");
  if (!state) {
    return res.end(`параматер ${code} не задан`);
  }
  const token = await OAuth2Client.getToken(code);

  const {
    tokens: { refresh_token },
  } = token;
  const userClient = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri,
  );
  userClient.setCredentials({ refresh_token: refresh_token! });

  const oauth2 = google.oauth2({
    auth: userClient,
    version: "v2",
  });
  const user = await userRepository.findOne({
    where: { telegramId: state },
  });
  if (!user) {
    return res.end("Пользователь не найден");
  }
  const userInfo = await oauth2.userinfo.get();
  const userEmail = userInfo.data.email;

  user.googleAccountEmail = userEmail!;
  user.googleAuthToken = refresh_token!;

  await userRepository.save(user!);

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    `<h1>Успешно!</h1><p>Вы вошли как ${userEmail}. Окно можно закрыть.</p>`,
  );
  bot.api.sendMessage(state, "Готово! Теперь введи название папки");
});
server.listen(3000);
