import fs from "node:fs";

export function loadSchema(relativeUrl) {
  return JSON.parse(fs.readFileSync(new URL(relativeUrl, import.meta.url), "utf8"));
}
