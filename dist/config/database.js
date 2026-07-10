import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { required } from "../utils/env.js";
import { User } from "../entities/User.js";
import { Video } from "../entities/Video.js";
export const AppDataSource = new DataSource({
    type: "postgres",
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT),
    username: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_NAME"),
    synchronize: true,
    logging: false,
    entities: [User, Video],
});
//# sourceMappingURL=database.js.map