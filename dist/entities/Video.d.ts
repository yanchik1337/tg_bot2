import { type Relation } from "typeorm";
import { User } from "./User.js";
export declare class Video {
    id: number;
    telegramFileId: string;
    googleDriveFileId?: string;
    fileName?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: Relation<User>;
}
//# sourceMappingURL=Video.d.ts.map