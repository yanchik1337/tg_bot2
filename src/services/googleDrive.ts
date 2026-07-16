import { google } from "googleapis";
import { getDriveClientForUser } from "../config/driveClient.js";

export async function createFolder(
  name: string,
  refreshToken: string,
): Promise<string> {
  const drive = getDriveClientForUser(refreshToken);
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

  return id;
}
