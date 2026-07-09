export function required(data: string): string {
  if (!process.env[data]) {
    throw new Error(`отсутствует параметр ${data}`);
  }

  return process.env[data];
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
