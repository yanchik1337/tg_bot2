import { Readable } from "node:stream";
import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import { required } from "../../utils/env.js";
import type { BotContext } from "../types/bot-types.js";
import { uploadFile } from "../../services/video.js";
import { Video } from "../../entities/Video.js";
import { startHanderlKeyboard } from "../keyboards/startHandelrKB.js";
import { createReadStream } from "node:fs";

export async function uploadVideoHandler(
  ctx: BotContext,
  next: () => Promise<void>,
) {
  const BOT_TOKEN = required("BOT_TOKEN");
  const userRepository = AppDataSource.getRepository(User);
  const videoRepository = AppDataSource.getRepository(Video);
  const videoId = ctx.message?.video?.file_id;
  const videoName = String(ctx.message?.video?.file_name);
  const telegramId = String(ctx.from?.id);
  const mime_type = String(ctx.message?.video?.mime_type);
  if (!videoId) {
    await ctx.reply("Не удалось загрузить видео, попробуйте еще раз");
    return;
  }
  const telegramFile = (await ctx.api.getFile(videoId)).file_path;
  const filePath = telegramFile!.split("/videos/")[1];
  console.log("file_PATH-videos", filePath);
  const videoURL = `http://telegram-api-server:8081/file/bot${BOT_TOKEN}/videos/${filePath}`;

  console.log("FILE_PATH:", telegramFile);
  console.log("DOWNLOAD_URL:", videoURL);

  const videoStream = createReadStream(telegramFile!);
  console.log("VIDEO_STREAM:", videoStream);
  const existingUser = await userRepository.findOne({
    where: { telegramId },
  });
  if (!existingUser) {
    await ctx.reply("Произошла ошибка при создании папки, попробуйте снова.");
    return;
  }
  const folderId = existingUser.googleDriveFolderId;
  if (!folderId) {
    await ctx.reply("Ошибка: не указан ID папки Google Drive!");
    return;
  }

  await ctx.reply("Загружаю видео на Google Drive...");

  const newVideoId = await uploadFile(
    videoStream,
    videoName,
    folderId,
    mime_type,
  );

  const currentVideo = videoRepository.create({
    telegramFileId: videoId,
    googleDriveFileId: newVideoId,
    fileName: videoName,
    status: "completed",
    user: existingUser,
  });

  await videoRepository.save(currentVideo);
  ctx.session.step = "idle";
  await ctx.reply(
    `Видео успешно загружено https://drive.google.com/file/d/${currentVideo.googleDriveFileId}/view`,
    {
      reply_markup: startHanderlKeyboard,
    },
  );
}
