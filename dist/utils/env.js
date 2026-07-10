export function required(data) {
    if (!process.env[data]) {
        throw new Error(`отсутствует параметр ${data}`);
    }
    return process.env[data];
}
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//# sourceMappingURL=env.js.map