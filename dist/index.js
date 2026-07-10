import "reflect-metadata";
import { AppDataSource } from "./config/database.js";
import { bot } from "./bot/bot.js";
bot.catch((err) => {
    console.error("Bot error:", err.error);
});
AppDataSource.initialize()
    .then(() => {
    console.log("Запуск системы...");
    return bot.start();
})
    .catch((err) => {
    console.error("Ошибка запуска:", err);
});
//# sourceMappingURL=index.js.map