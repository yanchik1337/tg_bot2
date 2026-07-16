import { required } from "../utils/env.js";
import { google } from "googleapis";
const client_id = required("GOOGLE_OAUTH_CLIENT_ID");
const client_secret = required("GOOGLE_OAUTH_CLIENT_SECRET");
const redirect_uri = required("GOOGLE_OAUTH_REDIRECT_URI");

export function getDriveClientForUser(refreshToken: string) {
  const client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: "v3", auth: client });
}
