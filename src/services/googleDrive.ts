import { google } from "googleapis";
import { OAuth2Client } from "../config/google.js";

const drive = google.drive({
  version: "v3",
  auth: OAuth2Client,
});

export async function createFolder(
  name: string,
  email: string,
): Promise<string> {
  if (!name) {
    throw new Error("Имя папки не задано!");
  }

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
    },
  });
  const { id } = response.data;
  if (!id) {
    throw new Error("Не удалось создать папку, попробуйте еще раз");
  }

  try {
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: "writer",
        type: "user",
        emailAddress: email,
      },
    });
  } catch (e: any) {
    console.error(`Не удалось выдать доступ к папке ${id} для ${email}:`, e);
  }
  return id;
}
