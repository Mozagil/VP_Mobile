// Checks every field in STORE_LISTING.md against the store's character limit.
// A field is a "**Label** (limit…)" line followed by its text (until the next
// "**" label or "#" heading). Run: node scripts/check-store-listing.mjs
import { readFileSync } from "node:fs";

const text = readFileSync(new URL("../STORE_LISTING.md", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const listing = text.slice(text.indexOf("## Google Play"));
const lines = listing.split("\n");
let section = "";
let failed = 0;
for (let i = 0; i < lines.length; i++) {
  const heading = lines[i].match(/^#{2,3} (.+)/);
  if (heading) section = lines[i].startsWith("## ") ? heading[1] : `${section.split(" / ")[0]} / ${heading[1]}`;
  const field = lines[i].match(/^\*\*(.+?)\*\* \((\d+)/);
  if (!field) continue;
  const body = [];
  for (let j = i + 1; j < lines.length && !/^(\*\*|#)/.test(lines[j]); j++) body.push(lines[j]);
  const value = body.join("\n").trim();
  if (/^(Google Play|Same as)/.test(value)) continue; // pointer to another field
  const limit = Number(field[2]);
  const length = [...value].length;
  const ok = length <= limit && length > 0;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${section} · ${field[1]}: ${length}/${limit}`);
}
process.exit(failed ? 1 : 0);
