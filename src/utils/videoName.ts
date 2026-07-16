export function cleanVideoName(filename: string): string {
  let name = filename.replace(/\.\w+$/, ""); // убрать расширение
  name = name.replace(/\d{4}[.\-]\d{2}[.\-]\d{2}/g, ""); // дата
  name = name.replace(/\d{2}[.:\-]\d{2}[.:\-]\d{2}(\.\d+)?/g, ""); // время
  name = name.replace(/\b(DVR|REC|VID|IMG)\b/gi, ""); // технические метки
  name = name.replace(/[-\s]+/g, " ").trim(); // лишние пробелы/дефисы
  return name;
}
