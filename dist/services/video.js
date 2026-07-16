import { getDriveClientForUser } from "../config/driveClient.js";
export async function uploadFile(content, name, folderId, mimeType, refreshToken) {
    const drive = getDriveClientForUser(refreshToken);
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
