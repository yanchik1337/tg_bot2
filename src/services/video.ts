import { google } from "googleapis";
import { OAuth2Client } from "../config/google.js";
import type { Readable } from "stream";

const drive = google.drive({
  version: "v3",
  auth: OAuth2Client,
});

export async function uploadFile(
  content: Readable,
  name: string,
  folderId: string,
  mimeType: string,
): Promise<string> {
  const response = await drive.files.create({
    requestBody: { name, parents: [folderId] },
    media: { body: content, mimeType },
  });
  const { id } = response.data;
  if (!id) {
    throw new Error("Не удалось загрузить видео, попробуйте еще раз");
  }
  return id;
}
