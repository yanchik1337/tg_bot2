import "reflect-metadata";
import { AppDataSource } from "./config/database.js";
import { bot } from "./bot/bot.js";
import { server } from "./bot/server.js";
AppDataSource.initialize()
    .then(() => {
    console.log("Запуск системы...");
    console.log("Вызываю bot.start()...");
    return bot.start({
        onStart: (botInfo) => {
            console.log("Бот успешно запущен:", botInfo.username);
        },
    });
})
    .catch((err) => {
    console.error("Ошибка запуска:", err);
});
